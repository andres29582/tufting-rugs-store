import type { Product } from '../../../../shared/types';
import type { Translate } from '../../../../shared/i18n';
import { buildWhatsappUrl } from '../../../../shared/config/contact';
import type { CustomizationSummary } from './customizationWizardTypes';

type WhatsAppSummaryInput = Omit<CustomizationSummary, 'whatsappMessage'>;

export function buildWhatsAppMessage(
  summary: WhatsAppSummaryInput,
  product: Product | null,
  t: Translate
): string {
  return [
    t('custom.whatsapp.greeting'),
    summary.requestId ? t('custom.whatsapp.requestId', { id: summary.requestId }) : '',
    t('custom.whatsapp.originManual'),
    '',
    t('custom.whatsapp.sectionRug'),
    product ? t('custom.whatsapp.rugType', { value: product.name }) : t('custom.whatsapp.rugTypeCustom'),
    t('custom.whatsapp.size', { value: valueOrPending(summary.sizeBase, t) }),
    t('custom.whatsapp.shape', { value: valueOrPending(summary.shape, t) }),
    '',
    t('custom.whatsapp.sectionDesign'),
    t('custom.whatsapp.placement', { value: valueOrPending(summary.placement, t) }),
    t('custom.whatsapp.intention', { value: valueOrPending(summary.intention, t) }),
    t('custom.whatsapp.style', { value: valueOrPending(summary.visualStyle, t) }),
    t('custom.whatsapp.colors', { value: summary.colorsToAvoid }),
    t('custom.whatsapp.reference', { value: summary.reference }),
    '',
    t('custom.whatsapp.observations'),
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWhatsAppUrl(summary: Pick<CustomizationSummary, 'whatsappMessage'>): string {
  return buildWhatsappUrl(summary.whatsappMessage);
}

function valueOrPending(value: string, t: Translate): string {
  return value || t('custom.pending');
}
