import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard';
import { ProductsService } from './products.service';
import type { CreateProductInput, UpdateProductInput } from './products.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findActive() {
    return this.products.findActive();
  }

  @Get(':id')
  findActiveById(@Param('id') id: string) {
    return this.products.findActiveById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateProductInput) {
    return this.products.create(body);
  }

  @Patch(':id/deactivate')
  @UseGuards(AdminGuard)
  deactivate(@Param('id') id: string) {
    return this.products.deactivate(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: UpdateProductInput) {
    return this.products.update(id, body);
  }
}
