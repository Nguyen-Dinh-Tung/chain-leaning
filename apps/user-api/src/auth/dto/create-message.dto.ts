import { ChainEnum } from '@app/libraries';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsEnum(ChainEnum)
  chainIdentifier: ChainEnum;

  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  address: string;
}
