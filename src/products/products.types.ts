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
  category?: string | null;
  imageUrl?: string | null;
  colors?: string[];
  features?: string[];
  material?: string | null;
  productionTime?: string | null;
  isCustomizable?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
};

export type UpdateProductInput = Partial<CreateProductInput>;
