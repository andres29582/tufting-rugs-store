import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';

@Controller('admin/products')
@UseGuards(AdminGuard)
export class AdminProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAllForAdmin() {
    return this.products.findAllForAdmin();
  }

  @Get(':id')
  findByIdForAdmin(@Param('id') id: string) {
    return this.products.findByIdForAdmin(id);
  }

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.products.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.products.update(id, body);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.products.publish(id);
  }

  @Patch(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.products.unpublish(id);
  }
}
