import { ChainEnum } from '@app/libraries';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  address: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  @IsEnum(ChainEnum)
  chainIdentifier: ChainEnum;
}
