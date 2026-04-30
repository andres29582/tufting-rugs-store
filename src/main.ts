import './config/load-env';
import { NestFactory } from '@nestjs/core';
import { configureApp, seedAppData } from './app.setup';
import { AppModule } from './app.module';
import { APP_CONFIG } from './config/app-config.provider';
import type { AppConfig } from './config/app-config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  const config = app.get<AppConfig>(APP_CONFIG);

  await seedAppData(app);
  await app.listen(config.port);
}

void bootstrap();
