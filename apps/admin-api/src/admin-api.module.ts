import { Module } from '@nestjs/common';
import { AdminApiController } from './admin-api.controller';
import { AdminApiService } from './admin-api.service';
import { CoreGlobalModule } from '@app/libraries';
import { ChainModule } from './chain/chain.module';

@Module({
  imports: [CoreGlobalModule.forRoot(), ChainModule],
  controllers: [AdminApiController],
  providers: [AdminApiService],
})
export class AdminApiModule {}
