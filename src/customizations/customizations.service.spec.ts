import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DesignReferenceKind,
  ProductType,
  RugFormat,
  SizeCategory
} from '../domain/domain-enums';
import type { OrdersService } from '../orders/orders.service';
import { CustomizationsService } from './customizations.service';

type MockPrisma = {
  product: {
    findFirst: jest.Mock;
  };
  customization: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
  };
};

function createMockPrisma(): MockPrisma {
  return {
    product: {
      findFirst: jest.fn()
    },
    customization: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  };
}

function createMockOrdersService(): Pick<OrdersService, 'create'> {
  return {
    create: jest.fn()
  } as unknown as Pick<OrdersService, 'create'>;
}

describe('CustomizationsService', () => {
  let prisma: MockPrisma;
  let orders: Pick<OrdersService, 'create'>;
  let service: CustomizationsService;

  beforeEach(() => {
    prisma = createMockPrisma();
    orders = createMockOrdersService();
    service = new CustomizationsService(prisma as never, orders as OrdersService);
  });

  describe('create', () => {
    it('requires a productId for the public FULL_CUSTOM flow', async () => {
      await expect(
        service.create({
          customerName: 'Ana',
          customerEmail: 'ana@example.com'
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.customization.create).not.toHaveBeenCalled();
    });

    it('rejects inactive or missing products', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(
        service.create({
          productId: 'product-1',
          customerName: 'Ana',
          customerEmail: 'ana@example.com'
        })
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects READY_MADE products for customization creation', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'product-1',
        type: ProductType.READY_MADE
      });

      await expect(
        service.create({
          productId: 'product-1',
          customerName: 'Ana',
          customerEmail: 'ana@example.com'
        })
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('creates a customization from a FULL_CUSTOM product', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'product-full-custom',
        type: ProductType.FULL_CUSTOM
      });
      prisma.customization.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'customization-1', ...data })
      );

      const customization = await service.create({
        productId: 'product-full-custom',
        customerName: ' Ana ',
        customerEmail: 'ANA@EXAMPLE.COM',
        customerPhone: ' 555 ',
        description: ' Logo rug ',
        preferredColors: ['red', ' blue ', 'RED', '', 'blue'],
        sizeCategory: SizeCategory.CUSTOM,
        sizeLabel: 'Sob orçamento',
        format: RugFormat.CUSTOM,
        designReferences: [
          {
            url: ' https://example.com/ref.png ',
            kind: DesignReferenceKind.CUSTOMER_REFERENCE,
            originalName: ' ref.png '
          }
        ]
      });

      expect(customization).toEqual(
        expect.objectContaining({
          id: 'customization-1',
          productId: 'product-full-custom',
          customerName: 'Ana',
          customerEmail: 'ana@example.com',
          customerPhone: '555',
          preferredColors: ['red', 'blue']
        })
      );
      expect(prisma.customization.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          designReferences: {
            create: [
              {
                kind: DesignReferenceKind.CUSTOMER_REFERENCE,
                url: 'https://example.com/ref.png',
                storageKey: null,
                mimeType: null,
                originalName: 'ref.png'
              }
            ]
          }
        }),
        include: {
          product: true,
          designReferences: true
        }
      });
    });

    it('rejects non-array preferredColors', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'product-full-custom',
        type: ProductType.FULL_CUSTOM
      });

      await expect(
        service.create({
          productId: 'product-full-custom',
          customerName: 'Ana',
          customerEmail: 'ana@example.com',
          preferredColors: 'red' as never
        })
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('createOrderFromCustomization', () => {
    it('creates an order using customer and product data from customization', async () => {
      prisma.customization.findUnique.mockResolvedValue({
        id: 'customization-1',
        productId: 'product-full-custom',
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        customerPhone: '555'
      });
      (orders.create as jest.Mock).mockResolvedValue({ id: 'order-1' });

      const order = await service.createOrderFromCustomization('customization-1', {
        estimatedPriceCents: 22000,
        notes: 'Created from customization'
      });

      expect(order).toEqual({ id: 'order-1' });
      expect(orders.create).toHaveBeenCalledWith({
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        customerPhone: '555',
        productId: 'product-full-custom',
        customizationId: 'customization-1',
        estimatedPriceCents: 22000,
        finalPriceCents: null,
        notes: 'Created from customization'
      });
    });

    it('rejects missing customization when creating an order', async () => {
      prisma.customization.findUnique.mockResolvedValue(null);

      await expect(
        service.createOrderFromCustomization('customization-1', {})
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects customization without linked product', async () => {
      prisma.customization.findUnique.mockResolvedValue({
        id: 'customization-1',
        productId: null,
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        customerPhone: null
      });

      await expect(
        service.createOrderFromCustomization('customization-1', {})
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects negative estimatedPriceCents', async () => {
      prisma.customization.findUnique.mockResolvedValue({
        id: 'customization-1',
        productId: 'product-full-custom',
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        customerPhone: null
      });

      await expect(
        service.createOrderFromCustomization('customization-1', {
          estimatedPriceCents: -1
        })
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
