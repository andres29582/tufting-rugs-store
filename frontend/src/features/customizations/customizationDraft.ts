import type {
  CustomizationDraft,
  CustomizationValidationErrors,
  RugFormat,
  SizeCategory
} from '../../shared/types';

export const customizationColorOptions = [
  { name: 'Azul profundo', value: '#1d2b53' },
  { name: 'Naranja tufting', value: '#f97316' },
  { name: 'Rosa arcilla', value: '#db5c91' },
  { name: 'Verde musgo', value: '#31482f' },
  { name: 'Arena cálida', value: '#f2e7d5' },
  { name: 'Negro gráfico', value: '#111111' }
] as const;

export const customizationSizeOptions = [
  { label: 'Pequeña', detail: 'Hasta 80 x 60 cm', sizeCategory: 'SMALL', sizeLabel: '80 x 60 cm' },
  { label: 'Media', detail: '100 x 80 cm aprox.', sizeCategory: 'MEDIUM', sizeLabel: '100 x 80 cm' },
  { label: 'Grande', detail: '120 x 160 cm aprox.', sizeCategory: 'LARGE', sizeLabel: '120 x 160 cm' },
  { label: 'A medida', detail: 'Definimos contigo', sizeCategory: 'CUSTOM', sizeLabel: 'A medida' }
] as const satisfies ReadonlyArray<{
  label: string;
  detail: string;
  sizeCategory: SizeCategory;
  sizeLabel: string;
}>;

export const customizationFormatOptions = [
  { label: 'Orgánica', value: 'ORGANIC' },
  { label: 'Rectangular', value: 'RECTANGULAR' },
  { label: 'Redonda', value: 'ROUND' },
  { label: 'Libre', value: 'CUSTOM' }
] as const satisfies ReadonlyArray<{
  label: string;
  value: RugFormat;
}>;

export function createCustomizationDraft(
  overrides: Partial<CustomizationDraft> = {}
): CustomizationDraft {
  return normalizeCustomizationDraft({
    productId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
    preferredColors: ['#1d2b53', '#f97316', '#db5c91'],
    sizeCategory: 'MEDIUM',
    sizeLabel: '100 x 80 cm',
    format: 'ORGANIC',
    referenceUrl: '',
    notes: '',
    ...overrides
  });
}

export function normalizeCustomizationDraft(draft: Partial<CustomizationDraft>): CustomizationDraft {
  const sizeOption =
    customizationSizeOptions.find((option) => option.sizeCategory === draft.sizeCategory) ||
    customizationSizeOptions[1];

  return {
    productId: String(draft.productId || '').trim(),
    customerName: String(draft.customerName || '').trim(),
    customerEmail: String(draft.customerEmail || '').trim().toLowerCase(),
    customerPhone: String(draft.customerPhone || '').trim(),
    description: String(draft.description || '').trim(),
    preferredColors: normalizeColors(draft.preferredColors),
    sizeCategory: sizeOption.sizeCategory,
    sizeLabel: String(draft.sizeLabel || sizeOption.sizeLabel).trim(),
    format: normalizeFormat(draft.format),
    referenceUrl: String(draft.referenceUrl || '').trim(),
    notes: String(draft.notes || '').trim()
  };
}

export function validateCustomizationDraft(draft: Partial<CustomizationDraft>): {
  draft: CustomizationDraft;
  errors: CustomizationValidationErrors;
  isValid: boolean;
} {
  const normalizedDraft = normalizeCustomizationDraft(draft);
  const errors: CustomizationValidationErrors = {};

  if (!normalizedDraft.customerName) {
    errors.customerName = 'Cuéntanos tu nombre.';
  }

  if (!isValidEmail(normalizedDraft.customerEmail)) {
    errors.customerEmail = 'Usa un email válido.';
  }

  if (!normalizedDraft.description || normalizedDraft.description.length < 12) {
    errors.description = 'Describe tu idea con un poco más de detalle.';
  }

  return {
    draft: normalizedDraft,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}

function normalizeColors(colors: string[] | undefined): string[] {
  if (!Array.isArray(colors)) {
    return [];
  }

  return colors
    .map((color) => String(color || '').trim())
    .filter(Boolean)
    .slice(0, 6);
}

function normalizeFormat(format: RugFormat | undefined): RugFormat {
  const selectedFormat = customizationFormatOptions.find((option) => option.value === format);

  return selectedFormat ? selectedFormat.value : customizationFormatOptions[0].value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
