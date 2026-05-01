const fallbackColors = ['#1d2b53', '#f97316', '#db5c91'];

export function mapProductFromApi(product) {
  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    category: product.category || getCategoryFromType(product.type),
    description: product.description || 'Alfombra tufting hecha a mano con acabado premium.',
    priceFrom: centsToDisplayPrice(product.basePriceCents || product.priceFromCents || 0),
    size: product.sizeLabel || product.size || 'A medida',
    image: product.image || '',
    colors: Array.isArray(product.colors) && product.colors.length ? product.colors : fallbackColors,
    features: Array.isArray(product.features) && product.features.length ? product.features : getDefaultFeatures(product),
    customizable: product.customizable !== false,
    motif: product.motif || 'waves'
  };
}

export function mapProductsFromApi(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map(mapProductFromApi);
}

function centsToDisplayPrice(value) {
  return Math.round(Number(value) / 100);
}

function getCategoryFromType(type) {
  if (type === 'FULL_CUSTOM') {
    return 'Personalizadas';
  }

  return 'Decorativas';
}

function getDefaultFeatures(product) {
  if (product.type === 'FULL_CUSTOM') {
    return ['100% personalizable', 'Aprobación previa', 'Medidas flexibles'];
  }

  return ['Hecha a mano', 'Material premium', 'Base antiderrapante'];
}
