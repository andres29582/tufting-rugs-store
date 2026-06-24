import type { Translate } from '../../../../shared/i18n';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SummaryItem } from './CustomizationSummaryItem';
import type { CustomizationSummary } from './customizationWizardTypes';

type CustomizationSummaryPanelProps = {
  summary: CustomizationSummary;
  t: Translate;
};

export function CustomizationSummaryPanel({ summary, t }: CustomizationSummaryPanelProps) {
  return (
    <aside className="customization-sidebar" aria-label={t('custom.sidebarAria')}>
      <CurrentSelection summary={summary} t={t} />
      <ImportantNotice t={t} />
    </aside>
  );
}

function CurrentSelection({ summary, t }: CustomizationSummaryPanelProps) {
  return (
    <section className="customization-side-card">
      <div className="customization-side-card__head">
        <h3>{t('custom.currentSelection')}</h3>
      </div>
      <dl className="customization-summary-list">
        <SummaryItem label={t('custom.summary.intention')} value={summary.intention} />
        <SummaryItem label={t('custom.summary.use')} value={summary.placement} />
        <SummaryItem label={t('custom.summary.style')} value={summary.visualStyle} />
        <SummaryItem label={t('custom.summary.shape')} value={summary.shape} />
        <SummaryItem label={t('custom.summary.size')} value={summary.sizeBase} />
        <SummaryItem label={t('custom.summary.colorsAvoid')} value={summary.colorsToAvoid} />
        <SummaryItem label={t('custom.summary.reference')} value={summary.reference} />
      </dl>
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
