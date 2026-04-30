import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard';
import { CustomizationsService } from './customizations.service';
import type {
  CreateCustomizationInput,
  CreateOrderFromCustomizationInput
} from './customizations.types';

@Controller('customizations')
export class CustomizationsController {
  constructor(private readonly customizations: CustomizationsService) {}

  @Post()
  create(@Body() body: CreateCustomizationInput) {
    return this.customizations.create(body);
  }

  @Post(':id/order')
  createOrderFromCustomization(
    @Param('id') id: string,
    @Body() body: CreateOrderFromCustomizationInput
  ) {
    return this.customizations.createOrderFromCustomization(id, body);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAllForAdmin() {
    return this.customizations.findAllForAdmin();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findByIdForAdmin(@Param('id') id: string) {
    return this.customizations.findByIdForAdmin(id);
  }
}
