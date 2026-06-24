import type { Product } from '../../../../shared/types';
import type { Translate, TranslationKey } from '../../../../shared/i18n';
import {
  colorAvoidOptions,
  getSelectedSize,
  intentionOptions,
  placementOptions,
  shapeOptions,
  visualStyleOptions,
} from './customizationWizardConfig';
import { buildWhatsAppMessage } from './whatsappMessage';
import type { CustomizationSummary, GuidedDraft } from './customizationWizardTypes';

export function buildSummary(
  draft: GuidedDraft,
  product: Product | null,
  t: Translate,
  requestId = ''
): CustomizationSummary {
  const selectedSize = getSelectedSize(draft.sizeBase);
  const reference =
    draft.referenceMode === 'LINK'
      ? draft.referenceUrl || t('custom.reference.pending')
      : draft.referenceMode === 'NONE'
        ? t('custom.reference.none')
        : '-';

  const summary = {
    labels: {
      intention: t('custom.summary.intention'),
      use: t('custom.summary.use'),
      style: t('custom.summary.style'),
      shape: t('custom.summary.shape'),
      size: t('custom.summary.size'),
      colorsAvoid: t('custom.summary.colorsAvoid'),
      reference: t('custom.summary.reference'),
    },
    intention: joinLabels(
      intentionOptions
        .filter((option) => draft.intentions.includes(option.value))
        .map((option) => t(option.labelKey))
    ),
    placement: getOptionLabel(placementOptions, draft.placement, t),
    visualStyle: getOptionLabel(visualStyleOptions, draft.visualStyle, t),
    shape: getOptionLabel(shapeOptions, draft.shape, t),
    sizeBase: selectedSize?.sizeLabel || '',
    colorsToAvoid:
      joinLabels(
        colorAvoidOptions
          .filter((option) => draft.colorsToAvoid.includes(option.value))
          .map((option) => t(option.labelKey))
      ) || t('custom.colors.noRestrictions'),
    reference,
    referenceUrl: draft.referenceUrl,
    requestId,
    whatsappMessage: '',
  };

  return {
    ...summary,
    whatsappMessage: buildWhatsAppMessage(summary, product, t),
  };
}

function getOptionLabel<T extends string>(
  options: ReadonlyArray<{ value: T; labelKey: TranslationKey }>,
  value: T | '',
  t: Translate
): string {
  if (!value) {
    return '';
  }

  const option = options.find((item) => item.value === value);

  return option ? t(option.labelKey) : '';
}

function joinLabels(labels: string[]): string {
  return labels.filter(Boolean).join(', ');
}
