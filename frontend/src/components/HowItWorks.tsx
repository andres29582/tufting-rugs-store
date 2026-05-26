import { useTranslation, type TranslationKey } from '../shared/i18n';
import { ButtonLink } from '../shared/components/Button/Button';

const steps: Array<{
  titleKey: TranslationKey;
  textKey: TranslationKey;
  icon: string;
}> = [
  {
    titleKey: 'how.idea.title',
    textKey: 'how.idea.text',
    icon: '<path d="m4 17 1 3 3-1L19 8l-4-4L4 15v2Z"/><path d="m13 6 4 4"/>'
  },
  {
    titleKey: 'how.design.title',
    textKey: 'how.design.text',
    icon: '<path d="M4 4h16v16H4z"/><path d="m8 16 8-8"/><path d="M8 8h.01M16 16h.01"/>'
  },
  {
    titleKey: 'how.approval.title',
    textKey: 'how.approval.text',
    icon: '<path d="m5 12 4 4L19 6"/>'
  },
  {
    titleKey: 'how.production.title',
    textKey: 'how.production.text',
    icon: '<path d="M12 21s-8-4.7-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.3-8 11-10 11Z"/>'
  }
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="como-funciona" className="how-section">
      <div className="how-panel glass-panel">
        <div className="section-copy">
          <p className="eyebrow">{t('how.eyebrow')}</p>
          <h2>{t('how.title')}</h2>
          <p>{t('how.copy')}</p>
          <ButtonLink className="section-copy-action" to="/personalizar" variant="primary">
            {t('how.cta')}
          </ButtonLink>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={step.titleKey}>
              <span className="step-index">0{index + 1}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: step.icon }} />
              <h3>{t(step.titleKey)}</h3>
              <p>{t(step.textKey)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
