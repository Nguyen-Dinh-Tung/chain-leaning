import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChainEntity } from '@app/libraries';
@Injectable()
export class ChainService {
  constructor(
    @InjectRepository(ChainEntity)
    private readonly chainRepo: Repository<ChainEntity>,
  ) {}
}
