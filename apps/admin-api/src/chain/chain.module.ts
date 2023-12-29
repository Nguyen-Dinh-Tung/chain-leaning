import { Module } from '@nestjs/common';
import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainEntity } from '@app/libraries';

@Module({
  imports: [TypeOrmModule.forFeature([ChainEntity])],
  controllers: [ChainController],
  providers: [ChainService],
})
export class ChainModule {}
