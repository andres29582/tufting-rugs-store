import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { OrdersModule } from '../orders/orders.module';
import { CustomizationsController } from './customizations.controller';
import { CustomizationsService } from './customizations.service';

@Module({
  imports: [AdminModule, OrdersModule],
  controllers: [CustomizationsController],
  providers: [CustomizationsService],
  exports: [CustomizationsService]
})
export class CustomizationsModule {}
