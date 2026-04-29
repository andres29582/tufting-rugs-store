import { ProductType, RugFormat, SizeCategory } from './product-domain';

export type CreateProductInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  type?: ProductType;
  basePriceCents?: number;
  sizeCategory?: SizeCategory;
  sizeLabel?: string;
  format?: RugFormat;
  isActive?: boolean;
};

export type UpdateProductInput = Partial<CreateProductInput>;
