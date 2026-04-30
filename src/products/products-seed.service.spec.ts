import {
  FULL_CUSTOM_ANCHOR_SLUG,
  ProductsSeedService
} from './products-seed.service';
import {
  ProductType,
  RugFormat,
  SizeCategory
} from '../domain/domain-enums';

type MockPrisma = {
  product: {
    upsert: jest.Mock;
  };
};

describe('ProductsSeedService', () => {
  it('seeds the FULL_CUSTOM anchor product idempotently', async () => {
    const prisma: MockPrisma = {
      product: {
        upsert: jest.fn().mockResolvedValue({ id: 'product-full-custom' })
      }
    };
    const service = new ProductsSeedService(prisma as never);

    await service.seedFullCustomAnchorIfNeeded();

    expect(prisma.product.upsert).toHaveBeenCalledWith({
      where: { slug: FULL_CUSTOM_ANCHOR_SLUG },
      update: {},
      create: expect.objectContaining({
        name: 'Alfombra 100% Personalizada',
        slug: FULL_CUSTOM_ANCHOR_SLUG,
        type: ProductType.FULL_CUSTOM,
        basePriceCents: 22000,
        sizeCategory: SizeCategory.CUSTOM,
        sizeLabel: 'Sob orçamento',
        format: RugFormat.CUSTOM,
        isActive: true
      })
    });
  });
});
