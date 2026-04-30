import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductType } from '../domain/domain-enums';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { assertValidMoneyCents } from '../orders/order-domain';
import {
  DesignReferenceKind,
  RugFormat,
  SizeCategory
} from '../domain/domain-enums';
import type {
  CreateCustomizationInput,
  CreateDesignReferenceInput,
  CreateOrderFromCustomizationInput
} from './customizations.types';

type FullCustomProductRecord = {
  id: string;
  type: ProductType;
};

type CustomizationForOrder = {
  id: string;
  productId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
};

@Injectable()
export class CustomizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService
  ) {}

  findAllForAdmin() {
    return this.prisma.customization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
        designReferences: true,
        order: true
      }
    });
  }

  async findByIdForAdmin(id: string) {
    const customization = await this.prisma.customization.findUnique({
      where: { id },
      include: {
        product: true,
        designReferences: true,
        order: true
      }
    });

    if (!customization) {
      throw new NotFoundException('Customization not found.');
    }

    return customization;
  }

  async create(input: CreateCustomizationInput) {
    const productId = requiredTrimmedString(input.productId, 'productId');
    await this.ensureFullCustomProduct(productId);

    const data = buildCustomizationData(input, productId);

    return this.prisma.customization.create({
      data,
      include: {
        product: true,
        designReferences: true
      }
    });
  }

  async createOrderFromCustomization(
    customizationId: string,
    input: CreateOrderFromCustomizationInput
  ) {
    const customization = await this.findCustomizationForOrderOrThrow(customizationId);

    if (!customization.productId) {
      throw new BadRequestException(
        'Customization must be linked to a FULL_CUSTOM product before creating an order.'
      );
    }

    if (input.estimatedPriceCents !== null && input.estimatedPriceCents !== undefined) {
      assertValidMoneyCents(input.estimatedPriceCents, 'estimatedPriceCents');
    }

    if (input.finalPriceCents !== null && input.finalPriceCents !== undefined) {
      assertValidMoneyCents(input.finalPriceCents, 'finalPriceCents');
    }

    return this.orders.create({
      customerName: customization.customerName,
      customerEmail: customization.customerEmail,
      customerPhone: customization.customerPhone,
      productId: customization.productId,
      customizationId: customization.id,
      estimatedPriceCents: input.estimatedPriceCents ?? null,
      finalPriceCents: input.finalPriceCents ?? null,
      notes: input.notes ?? null
    });
  }

  private async ensureFullCustomProduct(productId: string): Promise<FullCustomProductRecord> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true
      },
      select: {
        id: true,
        type: true
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (product.type !== ProductType.FULL_CUSTOM) {
      throw new BadRequestException(
        'Customizations can only be created from a FULL_CUSTOM product.'
      );
    }

    return product as FullCustomProductRecord;
  }

  private async findCustomizationForOrderOrThrow(
    customizationId: string
  ): Promise<CustomizationForOrder> {
    const customization = await this.prisma.customization.findUnique({
      where: { id: customizationId },
      select: {
        id: true,
        productId: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true
      }
    });

    if (!customization) {
      throw new NotFoundException('Customization not found.');
    }

    return customization as CustomizationForOrder;
  }
}

function buildCustomizationData(input: CreateCustomizationInput, productId: string) {
  const designReferences = normalizeDesignReferences(input.designReferences);

  return {
    productId,
    customerName: requiredTrimmedString(input.customerName, 'customerName'),
    customerEmail: requiredEmail(input.customerEmail),
    customerPhone: optionalTrimmedString(input.customerPhone),
    description: optionalTrimmedString(input.description),
    preferredColors: normalizePreferredColors(input.preferredColors),
    sizeCategory: input.sizeCategory
      ? requiredEnum(input.sizeCategory, SizeCategory, 'sizeCategory')
      : SizeCategory.CUSTOM,
    sizeLabel: optionalTrimmedString(input.sizeLabel),
    format: input.format
      ? requiredEnum(input.format, RugFormat, 'format')
      : RugFormat.CUSTOM,
    designReferences: designReferences.length
      ? {
          create: designReferences
        }
      : undefined
  };
}

function normalizePreferredColors(value: unknown): string[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new BadRequestException('preferredColors must be an array.');
  }

  const seen = new Set<string>();
  const colors: string[] = [];

  for (const item of value) {
    if (typeof item !== 'string') {
      throw new BadRequestException('preferredColors must contain only strings.');
    }

    const color = item.trim();

    if (!color) {
      continue;
    }

    const normalizedKey = color.toLowerCase();

    if (!seen.has(normalizedKey)) {
      seen.add(normalizedKey);
      colors.push(color);
    }
  }

  if (colors.length > 12) {
    throw new BadRequestException('preferredColors cannot contain more than 12 colors.');
  }

  return colors;
}

function normalizeDesignReferences(
  value: CreateDesignReferenceInput[] | undefined
) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new BadRequestException('designReferences must be an array.');
  }

  if (value.length > 10) {
    throw new BadRequestException('designReferences cannot contain more than 10 items.');
  }

  return value.map((reference) => ({
    kind: reference.kind
      ? requiredEnum(reference.kind, DesignReferenceKind, 'designReferences.kind')
      : DesignReferenceKind.CUSTOMER_REFERENCE,
    url: requiredTrimmedString(reference.url, 'designReferences.url'),
    storageKey: optionalTrimmedString(reference.storageKey),
    mimeType: optionalTrimmedString(reference.mimeType),
    originalName: optionalTrimmedString(reference.originalName)
  }));
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

function requiredEmail(value: unknown): string {
  const email = requiredTrimmedString(value, 'customerEmail').toLowerCase();

  if (!email.includes('@')) {
    throw new BadRequestException('customerEmail is invalid.');
  }

  return email;
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
