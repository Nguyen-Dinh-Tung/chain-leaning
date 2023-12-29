import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminApiModule } from './admin-api.module';
async function bootstrap() {
  const app = await NestFactory.create(AdminApiModule);
  const configService: ConfigService = app.get(ConfigService);
  const logger = new Logger();
  const port = configService.get<number>('ADMIN_PORT');
  await app.listen(port);

  logger.log('Server running port : ' + port);
}
bootstrap();
