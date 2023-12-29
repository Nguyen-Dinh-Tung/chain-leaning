import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChainEntity,
  ChainEnum,
  NonceEntity,
  WalletEntity,
} from '@app/libraries';
import { DataSource, EntityManager, IsNull, Not, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { getAddress, verifyMessage } from 'ethers';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from '@app/libraries/database/entities/account.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(NonceEntity)
    private readonly nonceRepo: Repository<NonceEntity>,

    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,

    @InjectRepository(ChainEntity)
    private readonly chainRepo: Repository<ChainEntity>,

    private readonly dataSource: DataSource,

    private jwtService: JwtService,
  ) {}

  async createMessage(data: CreateMessageDto) {
    const chain = await this.chainRepo.find({
      where: {
        identifier: data.chainIdentifier,
      },
    });

    if (!chain) {
      throw new BadRequestException('CHAIN_NOT_FOUND');
    }

    await this.cleanNonce(data.address);

    const nonce = uuidv4();
    await this.nonceRepo.upsert(
      {
        code: nonce,
        address: data.address,
      },
      { conflictPaths: ['address'] },
    );

    const message = this.getEthMessage(nonce, data.address);

    return {
      docs: {
        message,
      },
    };
  }

  async login(data: LoginDto) {
    const { nonce, chain } = await this.validateNonceAndChain(
      data.chainIdentifier,
      data.address,
    );

    await this.validateMessage(data.address, nonce.code, data.message);

    await this.validateSignature(data.address, data.signature, data.message);

    return await this.grantAccess(data.address, chain);
  }

  async generateToken(walletId: string): Promise<string> {
    return this.jwtService.signAsync({ walletId: walletId });
  }

  async grantAccess(address: string, chain: ChainEntity) {
    let checkWallet = await this.walletRepo.findOne({
      where: {
        chain: {
          identifier: chain.identifier,
        },
        address: address,
      },
    });

    if (!checkWallet) {
      await this.dataSource.transaction(async (em: EntityManager) => {
        checkWallet = await em.save(
          WalletEntity,
          em.create(WalletEntity, { address: address, chain: chain }),
        );

        await em.insert(
          AccountEntity,
          em.create(AccountEntity, { wallets: [checkWallet] }),
        );
      });
    }
    const token: string = await this.generateToken(checkWallet.id);

    await this.cleanNonce(address);

    return {
      docs: {
        token: token,
      },
    };
  }

  getEthMessage(nonce: string, address: string) {
    return `Wellcome to chain app with address : ${address} ,nonce: ${nonce}`;
  }

  async validateNonceAndChain(chainIdentifier: ChainEnum, address: string) {
    const nonce = await this.nonceRepo.findOne({
      where: {
        address: address,
        code: Not(IsNull()),
      },
    });

    if (!nonce) {
      throw new BadRequestException('ERROR_NONCE_NOT_FOUND');
    }

    const chain = await this.chainRepo.findOne({
      where: {
        identifier: chainIdentifier,
      },
    });

    return { chain, nonce };
  }

  async validateMessage(address: string, nonce: string, message: string) {
    if (message !== this.getEthMessage(nonce, address)) {
      await this.cleanNonce(address);
      throw new BadRequestException('ERROR_MESSAGE_INCORRECT');
    }
  }

  async validateSignature(address: string, signature: string, msg: string) {
    const decodeAddress = getAddress(address);
    const signedAddress = this.getSignedAddress(msg, signature);

    if (decodeAddress !== signedAddress) {
      await this.cleanNonce(address);
      throw new BadRequestException('SIGNATURE invalid');
    }
  }

  getSignedAddress(msg: string, signature: string) {
    try {
      const computedAddress = verifyMessage(msg, signature);
      return getAddress(computedAddress);
    } catch (e) {
      return '';
    }
  }
  async cleanNonce(address: string) {
    await this.nonceRepo.delete({ address: address });
  }
}
