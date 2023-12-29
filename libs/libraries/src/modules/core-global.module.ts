import { ConfigModule } from '@nestjs/config';
import { Module, Global, DynamicModule } from '@nestjs/common';
import { DatabaseOptions } from '../database/options/database-option.class';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity, AccountEntity } from '../database';
@Module({})
@Global()
export class CoreGlobalModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreGlobalModule,
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseOptions,
        }),
        TypeOrmModule.forFeature([WalletEntity, AccountEntity]),
      ],
    };
  }
}
