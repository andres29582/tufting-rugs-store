import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentAdmin } from '../admin/current-admin.decorator';
import { AdminGuard } from '../admin/admin.guard';
import type { AdminJwtPayload } from '../admin/admin-auth.types';
import {
  CreateOrderDto,
  ReviewOrderDto,
  UpdateFinalPriceDto,
  UpdateOrderStatusDto
} from './orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderDto) {
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
  updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, body);
  }

  @Patch(':id/review')
  @UseGuards(AdminGuard)
  review(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminJwtPayload,
    @Body() body: ReviewOrderDto
  ) {
    return this.orders.review(id, admin.sub, body);
  }

  @Patch(':id/confirm-deposit')
  @UseGuards(AdminGuard)
  confirmDeposit(@Param('id') id: string) {
    return this.orders.confirmDeposit(id);
  }

  @Patch(':id/final-price')
  @UseGuards(AdminGuard)
  updateFinalPrice(@Param('id') id: string, @Body() body: UpdateFinalPriceDto) {
    return this.orders.updateFinalPrice(id, body);
  }
}
