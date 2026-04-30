import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { AdminSeedService } from './admin/admin-seed.service';
import { ProductsSeedService } from './products/products-seed.service';

export function configureApp(app: INestApplication): INestApplication {
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
