import {
  DesignReferenceKind,
  RugFormat,
  SizeCategory
} from '../domain/domain-enums';

export type CreateDesignReferenceInput = {
  kind?: DesignReferenceKind;
  url?: string;
  storageKey?: string | null;
  mimeType?: string | null;
  originalName?: string | null;
};

export type CreateCustomizationInput = {
  productId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  description?: string | null;
  preferredColors?: string[];
  sizeCategory?: SizeCategory;
  sizeLabel?: string | null;
  format?: RugFormat;
  designReferences?: CreateDesignReferenceInput[];
};

export type CreateOrderFromCustomizationInput = {
  estimatedPriceCents?: number | null;
  finalPriceCents?: number | null;
  notes?: string | null;
};
