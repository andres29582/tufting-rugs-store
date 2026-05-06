import { Injectable } from '@nestjs/common';
import {
  ProductType,
  RugFormat,
  SizeCategory
} from '../domain/domain-enums';
import { PrismaService } from '../prisma/prisma.service';

export const FULL_CUSTOM_ANCHOR_SLUG = 'alfombra-100-personalizada';

@Injectable()
export class ProductsSeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedFullCustomAnchorIfNeeded() {
    return this.prisma.product.upsert({
      where: { slug: FULL_CUSTOM_ANCHOR_SLUG },
      update: {},
      create: {
        name: 'Alfombra 100% Personalizada',
        slug: FULL_CUSTOM_ANCHOR_SLUG,
        description: 'Entrada al flujo de cotizacion para alfombras personalizadas.',
        type: ProductType.FULL_CUSTOM,
        basePriceCents: 22000,
        sizeCategory: SizeCategory.CUSTOM,
        sizeLabel: 'Sob orçamento',
        format: RugFormat.CUSTOM,
        category: 'Personalizadas',
        colors: ['#1d2b53', '#f97316', '#db5c91'],
        features: ['100% personalizable', 'Aprobacion previa', 'Medidas flexibles'],
        material: 'Lana acrilica',
        productionTime: 'Bajo analisis',
        isCustomizable: true,
        isFeatured: true,
        isActive: true
      }
    });
  }
}
