import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from './config/config.module';
import { CustomizationsModule } from './customizations/customizations.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AdminModule,
    ProductsModule,
    OrdersModule,
    CustomizationsModule
  ]
})
export class AppModule {}
