import { Module } from '@nestjs/common';
import { UserApiController } from './user-api.controller';
import { UserApiService } from './user-api.service';
import { CoreGlobalModule } from '@app/libraries';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreGlobalModule.forRoot(), AuthModule],
  controllers: [UserApiController],
  providers: [UserApiService],
})
export class UserApiModule {}
