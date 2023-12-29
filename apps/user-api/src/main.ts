import { NestFactory } from '@nestjs/core';
import { UserApiModule } from './user-api.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(UserApiModule);
  const configService: ConfigService = app.get(ConfigService);
  const logger = new Logger();
  const port = configService.get<number>('USER_PORT');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  logger.log('Server running port : ' + port);
}
bootstrap();
