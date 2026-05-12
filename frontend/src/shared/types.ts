export type ProductType = 'READY_MADE' | 'FULL_CUSTOM';
export type SizeCategory = 'SMALL' | 'MEDIUM' | 'LARGE' | 'CUSTOM';
export type RugFormat = 'RECTANGULAR' | 'ROUND' | 'ORGANIC' | 'CUSTOM';
export type RugMotif = 'waves' | 'geometric' | 'organic' | 'circles' | 'arches' | 'soft';
export type ColorPalette = [string, string, string, ...string[]];

export type Product = {
  id: string;
  slug: string;
  type: ProductType | null;
  name: string;
  category: string;
  description: string;
  priceFrom: number;
  basePriceCents: number;
  size: string;
  sizeCategory: SizeCategory;
  format: RugFormat;
  image: string;
  imageUrl: string;
  colors: ColorPalette;
  features: string[];
  material: string;
  productionTime: string;
  customizable: boolean;
  isCustomizable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  motif: RugMotif;
};

export type ApiProduct = {
  id: string;
  slug?: string | null;
  type?: ProductType | null;
  name: string;
  category?: string | null;
  description?: string | null;
  basePriceCents?: number | null;
  priceFromCents?: number | null;
  sizeCategory?: SizeCategory | null;
  format?: RugFormat | null;
  sizeLabel?: string | null;
  size?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  colors?: string[] | null;
  features?: string[] | null;
  material?: string | null;
  productionTime?: string | null;
  isCustomizable?: boolean | null;
  isFeatured?: boolean | null;
  isActive?: boolean | null;
  customizable?: boolean | null;
  motif?: RugMotif | string | null;
};

export type AdminProductPayload = {
  name: string;
  slug: string;
  description: string | null;
  type: ProductType;
  basePriceCents: number;
  sizeCategory: SizeCategory;
  sizeLabel: string;
  format: RugFormat;
  category: string | null;
  imageUrl: string | null;
  colors: string[];
  features: string[];
  material: string | null;
  productionTime: string | null;
  isCustomizable: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

export type DesignReferenceKind = 'CUSTOMER_REFERENCE' | 'ADMIN_UPLOAD' | 'AI_GENERATED';

export type DesignReference = {
  id?: string;
  kind: DesignReferenceKind;
  url: string;
  storageKey?: string | null;
  mimeType?: string | null;
  originalName?: string | null;
};

export type AdminReview = {
  id: string;
  status: OrderStatus | null;
  productionPossible: boolean | null;
  estimatedPriceCents: number | null;
  finalPriceCents: number | null;
  depositAmountCents: number | null;
  comment: string;
  createdAt: string | null;
};

export type OrderStatus =
  | 'WAITING_ANALYSIS'
  | 'IN_ANALYSIS'
  | 'WAITING_CUSTOMER_APPROVAL'
  | 'APPROVED'
  | 'WAITING_DEPOSIT'
  | 'DEPOSIT_CONFIRMED'
  | 'DESIGN_APPROVED'
  | 'IN_PRODUCTION'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED';

export type Order = {
  id: string;
  publicCode: string;
  productId: string;
  customizationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  estimatedPriceCents: number | null;
  finalPriceCents: number | null;
  depositAmountCents: number | null;
  depositPaid: boolean;
  productionPossible: boolean;
  notes: string;
  createdAt: string | null;
  product: Product | null;
  customization: Customization | null;
  designReferences: DesignReference[];
  adminReviews: AdminReview[];
};

export type ApiOrder = {
  id: string;
  publicCode?: string | null;
  productId?: string | null;
  customizationId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  status: OrderStatus;
  estimatedPriceCents?: number | null;
  finalPriceCents?: number | null;
  depositAmountCents?: number | null;
  depositPaid?: boolean | null;
  productionPossible?: boolean | null;
  notes?: string | null;
  createdAt?: string | null;
  product?: ApiProduct | null;
  customization?: ApiCustomization | null;
  designReferences?: DesignReference[] | null;
  adminReviews?: Array<{
    id: string;
    status?: OrderStatus | null;
    productionPossible?: boolean | null;
    estimatedPriceCents?: number | null;
    finalPriceCents?: number | null;
    depositAmountCents?: number | null;
    comment?: string | null;
    createdAt?: string | null;
  }> | null;
};

export type OrderReviewPayload = {
  status?: OrderStatus;
  productionPossible?: boolean;
  estimatedPriceCents?: number | null;
  finalPriceCents?: number | null;
  comment?: string | null;
};

export type CustomizationDraft = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  preferredColors: string[];
  sizeCategory: SizeCategory;
  sizeLabel: string;
  format: RugFormat;
  referenceUrl: string;
  notes: string;
};

export type Customization = Omit<CustomizationDraft, 'referenceUrl' | 'notes'> & {
  id: string;
  designReferences: DesignReference[];
  createdAt: string | null;
};

export type AdminCustomization = Customization & {
  product: Product | null;
  order: {
    id: string;
    publicCode: string;
    status: OrderStatus;
    createdAt: string | null;
  } | null;
};

export type CustomizationValidationErrors = Partial<
  Record<keyof CustomizationDraft | 'preferredColors', string>
>;

export type ApiCustomization = {
  id: string;
  productId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  description?: string | null;
  preferredColors?: string[] | null;
  sizeCategory?: SizeCategory | null;
  sizeLabel?: string | null;
  format?: RugFormat | null;
  designReferences?: DesignReference[] | null;
  createdAt?: string | null;
  product?: ApiProduct | null;
  order?: ApiOrder | null;
};

export type SaveCustomizationResult =
  | {
      ok: false;
      draft: CustomizationDraft;
      errors: CustomizationValidationErrors;
    }
  | {
      ok: true;
      customization: Customization;
      mode: 'api' | 'mock';
    };
