import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertValidMoneyCents } from '../orders/order-domain';
import { ProductType, RugFormat, SizeCategory } from './product-domain';
import type { CreateProductInput, UpdateProductInput } from './products.types';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findActiveById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isActive: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  create(input: CreateProductInput) {
    const data = buildCreateProductData(input);

    return this.prisma.product.create({
      data
    });
  }

  async update(id: string, input: UpdateProductInput) {
    await this.ensureProductExists(id);
    const data = buildUpdateProductData(input);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No product fields were provided for update.');
    }

    return this.prisma.product.update({
      where: { id },
      data
    });
  }

  async deactivate(id: string) {
    await this.ensureProductExists(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
  }

  private async ensureProductExists(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }
  }
}

function buildCreateProductData(input: CreateProductInput) {
  const name = requiredTrimmedString(input.name, 'name');
  const slug = requiredTrimmedString(input.slug, 'slug');
  const sizeLabel = requiredTrimmedString(input.sizeLabel, 'sizeLabel');
  const type = requiredEnum(input.type, ProductType, 'type');
  const sizeCategory = requiredEnum(input.sizeCategory, SizeCategory, 'sizeCategory');
  const format = requiredEnum(input.format, RugFormat, 'format');

  if (input.basePriceCents === undefined) {
    throw new BadRequestException('basePriceCents is required.');
  }

  assertValidMoneyCents(input.basePriceCents, 'basePriceCents');

  return {
    name,
    slug,
    description: optionalTrimmedString(input.description),
    type,
    basePriceCents: input.basePriceCents,
    sizeCategory,
    sizeLabel,
    format,
    isActive: input.isActive ?? true
  };
}

function buildUpdateProductData(input: UpdateProductInput) {
  const data: Record<string, unknown> = {};

  if (input.name !== undefined) {
    data.name = requiredTrimmedString(input.name, 'name');
  }

  if (input.slug !== undefined) {
    data.slug = requiredTrimmedString(input.slug, 'slug');
  }

  if (input.description !== undefined) {
    data.description = optionalTrimmedString(input.description);
  }

  if (input.type !== undefined) {
    data.type = requiredEnum(input.type, ProductType, 'type');
  }

  if (input.basePriceCents !== undefined) {
    assertValidMoneyCents(input.basePriceCents, 'basePriceCents');
    data.basePriceCents = input.basePriceCents;
  }

  if (input.sizeCategory !== undefined) {
    data.sizeCategory = requiredEnum(input.sizeCategory, SizeCategory, 'sizeCategory');
  }

  if (input.sizeLabel !== undefined) {
    data.sizeLabel = requiredTrimmedString(input.sizeLabel, 'sizeLabel');
  }

  if (input.format !== undefined) {
    data.format = requiredEnum(input.format, RugFormat, 'format');
  }

  if (input.isActive !== undefined) {
    data.isActive = input.isActive;
  }

  return data;
}

function requiredTrimmedString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException(`${fieldName} is required.`);
  }

  return value.trim();
}

function optionalTrimmedString(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function requiredEnum<T extends Record<string, string>>(
  value: unknown,
  enumObject: T,
  fieldName: string
): T[keyof T] {
  const allowedValues = Object.values(enumObject);

  if (typeof value !== 'string' || !allowedValues.includes(value)) {
    throw new BadRequestException(`${fieldName} is invalid.`);
  }

  return value as T[keyof T];
}
