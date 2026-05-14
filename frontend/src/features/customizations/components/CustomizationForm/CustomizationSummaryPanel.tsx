import type { Translate } from '../../../../shared/i18n';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { buildWhatsAppUrl } from './whatsappMessage';
import { SummaryItem } from './CustomizationSummaryItem';
import type { CustomizationSummary } from './customizationWizardTypes';

type CustomizationSummaryPanelProps = {
  summary: CustomizationSummary;
  t: Translate;
  onEdit: () => void;
};

export function CustomizationSummaryPanel({ summary, t, onEdit }: CustomizationSummaryPanelProps) {
  return (
    <aside className="customization-sidebar" aria-label={t('custom.sidebarAria')}>
      <CurrentSelection summary={summary} t={t} onEdit={onEdit} />
      <WhatsAppPreview summary={summary} t={t} />
      <ImportantNotice t={t} />
    </aside>
  );
}

function CurrentSelection({
  summary,
  t,
  onEdit
}: CustomizationSummaryPanelProps) {
  return (
    <section className="customization-side-card">
      <div className="customization-side-card__head">
        <h3>{t('custom.currentSelection')}</h3>
        <button type="button" className="customization-edit-button" onClick={onEdit}>
          {t('custom.edit')}
        </button>
      </div>
      <dl className="customization-summary-list">
        <SummaryItem label={t('custom.summary.intention')} value={summary.intention} />
        <SummaryItem label={t('custom.summary.use')} value={summary.placement} />
        <SummaryItem label={t('custom.summary.style')} value={summary.visualStyle} />
        <SummaryItem label={t('custom.summary.shape')} value={summary.shape} />
        <SummaryItem label={t('custom.summary.size')} value={summary.sizeBase} />
        <SummaryItem label={t('custom.summary.colorsAvoid')} value={summary.colorsToAvoid} />
        <SummaryItem label={t('custom.summary.reference')} value={summary.reference} />
        <SummaryItem label={t('custom.summary.customerName')} value={summary.customerName} />
        <SummaryItem label={t('custom.summary.customerEmail')} value={summary.customerEmail} />
        <SummaryItem label={t('custom.summary.customerPhone')} value={summary.customerPhone} />
      </dl>
    </section>
  );
}

function WhatsAppPreview({ summary, t }: { summary: CustomizationSummary; t: Translate }) {
  return (
    <section className="customization-side-card customization-whatsapp-card">
      <div className="customization-whatsapp-mark" aria-hidden="true">
        WA
      </div>
      <div>
        <h3>{t('custom.whatsappTitle')}</h3>
        <p>{t('custom.whatsappText')}</p>
      </div>
      <a className="customization-whatsapp-link" href={buildWhatsAppUrl(summary)} target="_blank" rel="noreferrer">
        {t('custom.whatsappPreview')}
      </a>
    </section>
  );
}

function ImportantNotice({ t }: { t: Translate }) {
  return (
    <section className="customization-side-card customization-important-card">
      <span className="customization-inline-icon" aria-hidden="true">
        <Icon name="info" />
      </span>
      <div>
        <h3>{t('custom.importantTitle')}</h3>
        <p>{t('custom.importantText')}</p>
      </div>
    </section>
  );
}
