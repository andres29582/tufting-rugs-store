import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { OrderStatus, ProductType } from './order-domain';
import { OrdersService } from './orders.service';

type MockPrisma = {
  $transaction: jest.Mock;
  product: {
    findUnique: jest.Mock;
  };
  customization: {
    findUnique: jest.Mock;
  };
  order: {
    create: jest.Mock;
    findUnique: jest.Mock;
    findUniqueOrThrow: jest.Mock;
    update: jest.Mock;
  };
  adminReview: {
    create: jest.Mock;
  };
};

function createMockPrisma(): MockPrisma {
  const prisma = {
    $transaction: jest.fn(),
    product: {
      findUnique: jest.fn()
    },
    customization: {
      findUnique: jest.fn()
    },
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn()
    },
    adminReview: {
      create: jest.fn()
    }
  };

  prisma.$transaction.mockImplementation((callback) => callback(prisma));

  return prisma;
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

  describe('review', () => {
    it('updates order and writes an AdminReview snapshot in one transaction', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        depositPaid: false,
        productionPossible: true,
        estimatedPriceCents: 22000,
        finalPriceCents: null,
        depositAmountCents: 11000
      });
      prisma.order.findUniqueOrThrow.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
        estimatedPriceCents: 24000,
        finalPriceCents: 33333,
        depositAmountCents: 16667,
        adminReviews: [{ id: 'review-1' }]
      });

      const order = await service.review('order-1', 'admin-1', {
        status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
        estimatedPriceCents: 24000,
        finalPriceCents: 33333,
        productionPossible: true,
        comment: ' Approved with final quote '
      });

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: {
          status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
          productionPossible: true,
          estimatedPriceCents: 24000,
          finalPriceCents: 33333,
          depositAmountCents: 16667
        }
      });
      expect(prisma.adminReview.create).toHaveBeenCalledWith({
        data: {
          orderId: 'order-1',
          adminId: 'admin-1',
          status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
          productionPossible: true,
          estimatedPriceCents: 24000,
          finalPriceCents: 33333,
          depositAmountCents: 16667,
          comment: 'Approved with final quote'
        }
      });
      expect(order.adminReviews).toHaveLength(1);
    });

    it('records comment-only reviews without mutating the order', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        depositPaid: false,
        productionPossible: true,
        estimatedPriceCents: 22000,
        finalPriceCents: null,
        depositAmountCents: 11000
      });
      prisma.order.findUniqueOrThrow.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        adminReviews: [{ id: 'review-1' }]
      });

      await service.review('order-1', 'admin-1', {
        comment: 'Customer sent a clearer reference.'
      });

      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.adminReview.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          orderId: 'order-1',
          adminId: 'admin-1',
          status: OrderStatus.IN_ANALYSIS,
          productionPossible: true,
          estimatedPriceCents: 22000,
          finalPriceCents: null,
          depositAmountCents: 11000,
          comment: 'Customer sent a clearer reference.'
        })
      });
    });

    it('blocks DEPOSIT_CONFIRMED from the review endpoint', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.WAITING_DEPOSIT,
        depositPaid: false,
        productionPossible: true,
        estimatedPriceCents: 22000,
        finalPriceCents: null,
        depositAmountCents: 11000
      });

      await expect(
        service.review('order-1', 'admin-1', {
          status: OrderStatus.DEPOSIT_CONFIRMED,
          comment: 'Trying to skip confirm-deposit.'
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.adminReview.create).not.toHaveBeenCalled();
    });

    it('prevents non-producible orders from remaining in active workflow states', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.WAITING_DEPOSIT,
        depositPaid: false,
        productionPossible: true,
        estimatedPriceCents: 22000,
        finalPriceCents: null,
        depositAmountCents: 11000
      });

      await expect(
        service.review('order-1', 'admin-1', {
          productionPossible: false,
          comment: 'Cannot produce this design.'
        })
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.adminReview.create).not.toHaveBeenCalled();
    });

    it('allows marking an order as not producible when canceling it', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_ANALYSIS,
        depositPaid: false,
        productionPossible: true,
        estimatedPriceCents: 22000,
        finalPriceCents: null,
        depositAmountCents: 11000
      });
      prisma.order.findUniqueOrThrow.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CANCELED,
        productionPossible: false,
        adminReviews: [{ id: 'review-1' }]
      });

      const order = await service.review('order-1', 'admin-1', {
        status: OrderStatus.CANCELED,
        productionPossible: false,
        comment: 'Cannot produce this design.'
      });

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: {
          status: OrderStatus.CANCELED,
          productionPossible: false
        }
      });
      expect(order.status).toBe(OrderStatus.CANCELED);
    });

    it('rejects empty review payloads', async () => {
      await expect(service.review('order-1', 'admin-1', {})).rejects.toBeInstanceOf(
        BadRequestException
      );

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });
});
