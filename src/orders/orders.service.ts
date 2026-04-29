import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import {
  OrderStatus,
  ProductType,
  assertCanUpdateStatus,
  assertDepositStateIsConsistent,
  assertValidMoneyCents,
  calculateDepositAmountCents
} from './order-domain';
import type {
  ConfirmDepositResult,
  CreateOrderInput,
  UpdateFinalPriceInput,
  UpdateOrderStatusInput
} from './orders.types';

type ProductRecord = {
  id: string;
  type: ProductType;
  basePriceCents: number;
};

type OrderRecord = {
  id: string;
  status: OrderStatus;
  depositPaid: boolean;
  productionPossible: boolean;
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
        customization: true
      }
    });
  }

  async findByIdForAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
        customization: true,
        designReferences: true,
        adminReviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async create(input: CreateOrderInput) {
    const productId = input.productId ?? null;
    const customizationId = input.customizationId ?? null;

    if (!productId && !customizationId) {
      throw new BadRequestException('Order must include productId or customizationId.');
    }

    const product = productId ? await this.findProductOrThrow(productId) : null;

    if (customizationId) {
      await this.ensureCustomizationCanGenerateOrder(customizationId);
    }

    if (product?.type === ProductType.FULL_CUSTOM && !customizationId) {
      throw new BadRequestException(
        'FULL_CUSTOM products require a customization before creating an order.'
      );
    }

    const estimatedPriceCents =
      input.estimatedPriceCents ?? product?.basePriceCents ?? null;
    const finalPriceCents = input.finalPriceCents ?? null;

    if (estimatedPriceCents !== null) {
      assertValidMoneyCents(estimatedPriceCents, 'estimatedPriceCents');
    }

    if (finalPriceCents !== null) {
      assertValidMoneyCents(finalPriceCents, 'finalPriceCents');
    }

    const depositPricingBaseCents = finalPriceCents ?? estimatedPriceCents;

    return this.prisma.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone ?? null,
        productId,
        customizationId,
        status: OrderStatus.WAITING_ANALYSIS,
        estimatedPriceCents,
        finalPriceCents,
        depositAmountCents: calculateDepositAmountCents(depositPricingBaseCents),
        depositPaid: false,
        productionPossible: true,
        notes: input.notes ?? null
      }
    });
  }

  async updateStatus(id: string, input: UpdateOrderStatusInput) {
    const order = await this.findOrderForRulesOrThrow(id);

    assertCanUpdateStatus(order, input.status);

    return this.prisma.order.update({
      where: { id },
      data: { status: input.status }
    });
  }

  async confirmDeposit(id: string): Promise<ConfirmDepositResult> {
    const order = await this.findOrderForRulesOrThrow(id);
    assertDepositStateIsConsistent(order);

    if (order.status !== OrderStatus.WAITING_DEPOSIT) {
      throw new BadRequestException(
        'Deposit can only be confirmed when order status is WAITING_DEPOSIT.'
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        depositPaid: true,
        status: OrderStatus.DEPOSIT_CONFIRMED
      }
    });
  }

  async updateFinalPrice(id: string, input: UpdateFinalPriceInput) {
    assertValidMoneyCents(input.finalPriceCents, 'finalPriceCents');

    await this.findOrderForRulesOrThrow(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        finalPriceCents: input.finalPriceCents,
        depositAmountCents: calculateDepositAmountCents(input.finalPriceCents)
      }
    });
  }

  private async findProductOrThrow(productId: string): Promise<ProductRecord> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        type: true,
        basePriceCents: true
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product as ProductRecord;
  }

  private async ensureCustomizationCanGenerateOrder(customizationId: string): Promise<void> {
    const customization = await this.prisma.customization.findUnique({
      where: { id: customizationId },
      select: { id: true }
    });

    if (!customization) {
      throw new NotFoundException('Customization not found.');
    }

    const existingOrder = await this.prisma.order.findUnique({
      where: { customizationId },
      select: { id: true }
    });

    if (existingOrder) {
      throw new ConflictException('Customization already has an order.');
    }
  }

  private async findOrderForRulesOrThrow(id: string): Promise<OrderRecord> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        depositPaid: true,
        productionPossible: true
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order as OrderRecord;
  }
}
