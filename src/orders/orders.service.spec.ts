import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { OrderStatus, ProductType } from './order-domain';
import { OrdersService } from './orders.service';

type MockPrisma = {
  product: {
    findUnique: jest.Mock;
  };
  customization: {
    findUnique: jest.Mock;
  };
  order: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

function createMockPrisma(): MockPrisma {
  return {
    product: {
      findUnique: jest.fn()
    },
    customization: {
      findUnique: jest.fn()
    },
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    }
  };
}

describe('OrdersService business rules', () => {
  let prisma: MockPrisma;
  let service: OrdersService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new OrdersService(prisma as never);
  });

  describe('create', () => {
    it('rejects an order without productId or customizationId', async () => {
      await expect(
        service.create({
          customerName: 'Ana',
          customerEmail: 'ana@example.com'
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it('rejects an unknown product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          customerName: 'Ana',
          customerEmail: 'ana@example.com',
          productId: 'product-1'
        })
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects FULL_CUSTOM orders without a customization', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'product-1',
        type: ProductType.FULL_CUSTOM,
        basePriceCents: 22000
      });

      await expect(
        service.create({
          customerName: 'Ana',
          customerEmail: 'ana@example.com',
          productId: 'product-1'
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it('rejects an order when customization does not exist', async () => {
      prisma.customization.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          customerName: 'Ana',
          customerEmail: 'ana@example.com',
          customizationId: 'customization-1'
        })
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects a second order for the same customization', async () => {
      prisma.customization.findUnique.mockResolvedValue({ id: 'customization-1' });
      prisma.order.findUnique.mockResolvedValue({ id: 'order-existing' });

      await expect(
        service.create({
          customerName: 'Ana',
          customerEmail: 'ana@example.com',
          customizationId: 'customization-1'
        })
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates an order and calculates deposit from product base price', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'product-1',
        type: ProductType.READY_MADE,
        basePriceCents: 22000
      });
      prisma.order.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.create({
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        productId: 'product-1'
      });

      expect(order.depositAmountCents).toBe(11000);
      expect(order.depositPaid).toBe(false);
      expect(order.status).toBe(OrderStatus.WAITING_ANALYSIS);
    });

    it('uses finalPriceCents over estimatedPriceCents when calculating deposit', async () => {
      prisma.customization.findUnique.mockResolvedValue({ id: 'customization-1' });
      prisma.order.findUnique.mockResolvedValue(null);
      prisma.order.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.create({
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        customizationId: 'customization-1',
        estimatedPriceCents: 22000,
        finalPriceCents: 25501
      });

      expect(order.depositAmountCents).toBe(12751);
    });

    it('allows FULL_CUSTOM through the Product to Customization to Order flow', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'product-full-custom',
        type: ProductType.FULL_CUSTOM,
        basePriceCents: 22000
      });
      prisma.customization.findUnique.mockResolvedValue({ id: 'customization-1' });
      prisma.order.findUnique.mockResolvedValue(null);
      prisma.order.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.create({
        customerName: 'Ana',
        customerEmail: 'ana@example.com',
        productId: 'product-full-custom',
        customizationId: 'customization-1'
      });

      expect(order.productId).toBe('product-full-custom');
      expect(order.customizationId).toBe('customization-1');
    });
  });

  describe('updateStatus', () => {
    it('allows cancellation from WAITING_ANALYSIS', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.WAITING_ANALYSIS,
        depositPaid: false,
        productionPossible: true
      });
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.updateStatus('order-1', {
        status: OrderStatus.CANCELED
      });

      expect(order.status).toBe(OrderStatus.CANCELED);
    });

    it('blocks common transition to DEPOSIT_CONFIRMED', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.WAITING_DEPOSIT,
        depositPaid: false,
        productionPossible: true
      });

      await expect(
        service.updateStatus('order-1', {
          status: OrderStatus.DEPOSIT_CONFIRMED
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('blocks cancellation after IN_PRODUCTION', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_PRODUCTION,
        depositPaid: true,
        productionPossible: true
      });

      await expect(
        service.updateStatus('order-1', {
          status: OrderStatus.CANCELED
        })
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('treats CANCELED as a final status', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CANCELED,
        depositPaid: false,
        productionPossible: true
      });

      await expect(
        service.updateStatus('order-1', {
          status: OrderStatus.IN_ANALYSIS
        })
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('blocks approval flow when productionPossible is false', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        depositPaid: false,
        productionPossible: false
      });

      await expect(
        service.updateStatus('order-1', {
          status: OrderStatus.WAITING_CUSTOMER_APPROVAL
        })
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('allows cancellation when productionPossible is false', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        depositPaid: false,
        productionPossible: false
      });
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.updateStatus('order-1', {
        status: OrderStatus.CANCELED
      });

      expect(order.status).toBe(OrderStatus.CANCELED);
    });
  });

  describe('confirmDeposit', () => {
    it('confirms deposit only from WAITING_DEPOSIT and synchronizes fields', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.WAITING_DEPOSIT,
        depositPaid: false,
        productionPossible: true
      });
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.confirmDeposit('order-1');

      expect(order).toEqual({
        id: 'order-1',
        status: OrderStatus.DEPOSIT_CONFIRMED,
        depositPaid: true
      });
    });

    it('rejects deposit confirmation outside WAITING_DEPOSIT', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.APPROVED,
        depositPaid: false,
        productionPossible: true
      });

      await expect(service.confirmDeposit('order-1')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });

    it('rejects inconsistent persisted deposit state', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.DEPOSIT_CONFIRMED,
        depositPaid: false,
        productionPossible: true
      });

      await expect(service.confirmDeposit('order-1')).rejects.toBeInstanceOf(
        ConflictException
      );
    });
  });

  describe('updateFinalPrice', () => {
    it('recalculates depositAmountCents as 50 percent of finalPriceCents', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        depositPaid: false,
        productionPossible: true
      });
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'order-1', ...data })
      );

      const order = await service.updateFinalPrice('order-1', {
        finalPriceCents: 33333
      });

      expect(order.finalPriceCents).toBe(33333);
      expect(order.depositAmountCents).toBe(16667);
    });

    it('rejects negative finalPriceCents', async () => {
      await expect(
        service.updateFinalPrice('order-1', {
          finalPriceCents: -1
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.order.findUnique).not.toHaveBeenCalled();
      expect(prisma.order.update).not.toHaveBeenCalled();
    });
  });
});
