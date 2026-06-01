import type { Product } from '../../../../shared/types';
import type { Translate } from '../../../../shared/i18n';
import type { CustomizationSummary } from './customizationWizardTypes';

type WhatsAppSummaryInput = Omit<CustomizationSummary, 'whatsappMessage'>;
const storeWhatsappNumber = '5541985291212';

export function buildWhatsAppMessage(
  summary: WhatsAppSummaryInput,
  product: Product | null,
  t: Translate
): string {
  return [
    t('custom.whatsapp.greeting'),
    summary.requestId ? t('custom.whatsapp.requestId', { id: summary.requestId }) : '',
    product ? t('custom.whatsapp.base', { name: product.name }) : '',
    t('custom.whatsapp.intention', { value: valueOrPending(summary.intention, t) }),
    t('custom.whatsapp.placement', { value: valueOrPending(summary.placement, t) }),
    t('custom.whatsapp.style', { value: valueOrPending(summary.visualStyle, t) }),
    t('custom.whatsapp.shape', { value: valueOrPending(summary.shape, t) }),
    t('custom.whatsapp.size', { value: valueOrPending(summary.sizeBase, t) }),
    t('custom.whatsapp.colors', { value: summary.colorsToAvoid }),
    t('custom.whatsapp.reference', { value: summary.reference })
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWhatsAppUrl(summary: Pick<CustomizationSummary, 'whatsappMessage'>): string {
  return 'https://wa.me/' + storeWhatsappNumber + '?text=' + encodeURIComponent(summary.whatsappMessage);
}

function valueOrPending(value: string, t: Translate): string {
  return value || t('custom.pending');
}
