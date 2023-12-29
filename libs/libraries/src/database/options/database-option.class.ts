import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ChainEntity, NonceEntity, WalletEntity } from '../entities';

export class DatabaseOptions implements TypeOrmOptionsFactory {
  public createTypeOrmOptions():
    | Promise<TypeOrmModuleOptions>
    | TypeOrmModuleOptions {
    return {
      type: 'mysql',
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: process.env.ENVIROMENT === 'test' ? true : false,
      autoLoadEntities: true,
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123123',
      database: 'blockchain',
      entities: [WalletEntity, NonceEntity, ChainEntity],
      logging:
        process.env.ENVIROMENT === 'test'
          ? ['query', 'error', 'warn', 'info']
          : ['error', 'warn'],
    };
  }
}
