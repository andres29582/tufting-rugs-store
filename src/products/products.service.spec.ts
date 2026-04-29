import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductType, RugFormat, SizeCategory } from './product-domain';
import { ProductsService } from './products.service';

type MockPrisma = {
  product: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

function createMockPrisma(): MockPrisma {
  return {
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  };
}

describe('ProductsService', () => {
  let prisma: MockPrisma;
  let service: ProductsService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new ProductsService(prisma as never);
  });

  it('returns only active products for public catalog', async () => {
    prisma.product.findMany.mockResolvedValue([]);

    await service.findActive();

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  });

  it('returns 404 for inactive or missing public product', async () => {
    prisma.product.findFirst.mockResolvedValue(null);

    await expect(service.findActiveById('product-1')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('creates a valid FULL_CUSTOM anchor product', async () => {
    prisma.product.create.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'product-1', ...data })
    );

    const product = await service.create({
      name: 'Alfombra 100% Personalizada',
      slug: 'alfombra-100-personalizada',
      type: ProductType.FULL_CUSTOM,
      basePriceCents: 22000,
      sizeCategory: SizeCategory.CUSTOM,
      sizeLabel: 'Sob orçamento',
      format: RugFormat.CUSTOM
    });

    expect(product.type).toBe(ProductType.FULL_CUSTOM);
    expect(product.basePriceCents).toBe(22000);
    expect(product.isActive).toBe(true);
  });

  it('rejects negative basePriceCents', async () => {
    expect(() =>
      service.create({
        name: 'Alfombra',
        slug: 'alfombra',
        type: ProductType.READY_MADE,
        basePriceCents: -1,
        sizeCategory: SizeCategory.SMALL,
        sizeLabel: '50 x 50 cm',
        format: RugFormat.RECTANGULAR
      })
    ).toThrow(BadRequestException);
  });

  it('updates product fields after checking existence', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'product-1' });
    prisma.product.update.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'product-1', ...data })
    );

    const product = await service.update('product-1', {
      basePriceCents: 30000
    });

    expect(product.basePriceCents).toBe(30000);
  });

  it('rejects empty product updates', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'product-1' });

    await expect(service.update('product-1', {})).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('deactivates products instead of deleting them', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'product-1' });
    prisma.product.update.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'product-1', ...data })
    );

    const product = await service.deactivate('product-1');

    expect(product.isActive).toBe(false);
  });
});
