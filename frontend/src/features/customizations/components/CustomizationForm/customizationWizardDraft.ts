import type { CustomizationDraft, Product } from '../../../../shared/types';
import type { Translate } from '../../../../shared/i18n';
import { getSelectedSize, shapeOptions } from './customizationWizardConfig';
import type { CustomizationSummary, GuidedDraft } from './customizationWizardTypes';

export function buildCustomizationDraftFromWizard(
  draft: GuidedDraft,
  summary: CustomizationSummary,
  product: Product | null,
  t: Translate
): CustomizationDraft {
  const selectedSize = getSelectedSize(draft.sizeBase);
  const selectedShape = shapeOptions.find((option) => option.value === draft.shape);

  return {
    productId: product?.id || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: buildCustomizationDescription(
      summary,
      product,
      selectedShape?.format || 'CUSTOM',
      t
    ),
    preferredColors: [],
    sizeCategory: selectedSize?.sizeCategory || 'CUSTOM',
    sizeLabel: selectedSize?.sizeLabel || '',
    format: selectedShape?.format || 'CUSTOM',
    referenceUrl: draft.referenceMode === 'LINK' ? draft.referenceUrl : '',
    notes: '',
  };
}

function buildCustomizationDescription(
  summary: CustomizationSummary,
  product: Product | null,
  backendFormat: CustomizationDraft['format'],
  t: Translate
): string {
  return [
    t('custom.lead.descriptionTitle'),
    '',
    t('custom.lead.productSection'),
    `${t('custom.lead.productName')}: ${product?.name || t('custom.pending')}`,
    `${t('custom.lead.productId')}: ${product?.id || t('custom.pending')}`,
    '',
    t('custom.lead.designSection'),
    `${summary.labels.intention}: ${valueOrPending(summary.intention, t)}`,
    `${summary.labels.use}: ${valueOrPending(summary.placement, t)}`,
    `${summary.labels.style}: ${valueOrPending(summary.visualStyle, t)}`,
    `${summary.labels.shape}: ${valueOrPending(summary.shape, t)}`,
    `${summary.labels.size}: ${valueOrPending(summary.sizeBase, t)}`,
    `${t('custom.lead.backendFormat')}: ${backendFormat}`,
    `${summary.labels.colorsAvoid}: ${summary.colorsToAvoid}`,
    `${summary.labels.reference}: ${summary.reference}`,
  ].join('\n');
}

function valueOrPending(value: string, t: Translate): string {
  return value || t('custom.pending');
}
