import { type INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AdminSeedService } from './admin/admin-seed.service';
import { APP_CONFIG } from './config/app-config.provider';
import type { AppConfig } from './config/app-config';
import { ProductsSeedService } from './products/products-seed.service';

export function configureApp(app: INestApplication): INestApplication {
  const config = app.get<AppConfig>(APP_CONFIG);

  app.use(helmet());

  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true
    })
  );

  return app;
}

export async function seedAppData(app: INestApplication): Promise<void> {
  await app.get(AdminSeedService).seedConfiguredAdminIfNeeded();
  await app.get(ProductsSeedService).seedFullCustomAnchorIfNeeded();
}
