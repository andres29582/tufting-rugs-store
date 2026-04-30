import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { ProductsController } from './products.controller';
import { ProductsSeedService } from './products-seed.service';
import { ProductsService } from './products.service';

@Module({
  imports: [AdminModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsSeedService],
  exports: [ProductsService, ProductsSeedService]
})
export class ProductsModule {}
