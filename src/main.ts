import { NestFactory } from '@nestjs/core';
import { AdminSeedService } from './admin/admin-seed.service';
import { AppModule } from './app.module';
import { APP_CONFIG } from './config/app-config.provider';
import type { AppConfig } from './config/app-config';
import { ProductsSeedService } from './products/products-seed.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfig>(APP_CONFIG);

  await app.get(AdminSeedService).seedConfiguredAdminIfNeeded();
  await app.get(ProductsSeedService).seedFullCustomAnchorIfNeeded();
  await app.listen(config.port);
}

void bootstrap();
