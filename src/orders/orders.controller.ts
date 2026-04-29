import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard';
import { OrdersService } from './orders.service';
import type {
  CreateOrderInput,
  UpdateFinalPriceInput,
  UpdateOrderStatusInput
} from './orders.types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderInput) {
    return this.orders.create(body);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAllForAdmin() {
    return this.orders.findAllForAdmin();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findByIdForAdmin(@Param('id') id: string) {
    return this.orders.findByIdForAdmin(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusInput) {
    return this.orders.updateStatus(id, body);
  }

  @Patch(':id/confirm-deposit')
  @UseGuards(AdminGuard)
  confirmDeposit(@Param('id') id: string) {
    return this.orders.confirmDeposit(id);
  }

  @Patch(':id/final-price')
  @UseGuards(AdminGuard)
  updateFinalPrice(@Param('id') id: string, @Body() body: UpdateFinalPriceInput) {
    return this.orders.updateFinalPrice(id, body);
  }
}
