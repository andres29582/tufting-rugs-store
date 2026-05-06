export function mapCustomizationDraftToApi(draft) {
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

export function mapCustomizationFromApi(customization) {
  return {
    id: customization.id,
    productId: customization.productId,
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
    designReferences: Array.isArray(customization.designReferences)
      ? customization.designReferences
      : [],
    createdAt: customization.createdAt || null
  };
}
