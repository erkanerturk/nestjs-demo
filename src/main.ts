import { NestFactory } from '@nestjs/core';
import { Logger } from "@nestjs/common";
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 3000
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  logger.log('Application listening on port ' + PORT)
}
bootstrap();
