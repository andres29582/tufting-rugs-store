import type {
  AdminCustomization,
  ApiCustomization,
  Customization,
  CustomizationDraft,
  DesignReference
} from '../../shared/types';
import { mapProductFromApi } from '../products/productsMapper';

type ApiCustomizationDraft = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  description: string | null;
  preferredColors: string[];
  sizeCategory: CustomizationDraft['sizeCategory'];
  sizeLabel: string | null;
  format: CustomizationDraft['format'];
  designReferences: Array<{
    kind: 'CUSTOMER_REFERENCE';
    url: string;
  }>;
};

export function mapCustomizationDraftToApi(draft: CustomizationDraft): ApiCustomizationDraft {
  return {
    productId: draft.productId,
    customerName: draft.customerName,
    customerEmail: draft.customerEmail,
    customerPhone: draft.customerPhone || null,
    description: draft.description || null,
    preferredColors: draft.preferredColors,
    sizeCategory: draft.sizeCategory,
    sizeLabel: draft.sizeLabel || null,
    format: draft.format,
    designReferences: draft.referenceUrl
      ? [
          {
            kind: 'CUSTOMER_REFERENCE',
            url: draft.referenceUrl
          }
        ]
      : []
  };
}

export function mapCustomizationFromApi(customization: ApiCustomization): Customization {
  return {
    id: customization.id,
    productId: customization.productId || '',
    customerName: customization.customerName,
    customerEmail: customization.customerEmail,
    customerPhone: customization.customerPhone || '',
    description: customization.description || '',
    preferredColors: Array.isArray(customization.preferredColors)
      ? customization.preferredColors
      : [],
    sizeCategory: customization.sizeCategory || 'CUSTOM',
    sizeLabel: customization.sizeLabel || 'A medida',
    format: customization.format || 'CUSTOM',
    designReferences: normalizeReferences(customization.designReferences),
    createdAt: customization.createdAt || null
  };
}

export function mapAdminCustomizationFromApi(customization: ApiCustomization): AdminCustomization {
  return {
    ...mapCustomizationFromApi(customization),
    product: customization.product ? mapProductFromApi(customization.product) : null,
    order: customization.order
      ? {
          id: customization.order.id,
          publicCode: customization.order.publicCode || customization.order.id,
          status: customization.order.status,
          createdAt: customization.order.createdAt || null
        }
      : null
  };
}

function normalizeReferences(references: DesignReference[] | null | undefined): DesignReference[] {
  return Array.isArray(references) ? references : [];
}
