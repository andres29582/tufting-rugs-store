import type { FormEvent } from 'react';
import type { CustomizationDraft, Product } from '../../../../shared/types';
import { Button } from '../../../../shared/components/Button/Button';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { useTranslation } from '../../../../shared/i18n';
import { CustomizationStepContent } from './CustomizationStepContent';
import { CustomizationStepProgress } from './CustomizationStepProgress';
import { CustomizationSummaryPanel } from './CustomizationSummaryPanel';
import { getStepDescription, getStepQuestion } from './customizationWizardCopy';
import { steps } from './customizationWizardConfig';
import { useCustomizationWizard } from './useCustomizationWizard';
import './CustomizationForm.css';

type CustomizationFormProps = {
  product: Product | null;
  initialDraft?: Partial<CustomizationDraft>;
};

export function CustomizationForm({ product, initialDraft = {} }: CustomizationFormProps) {
  const { language, t } = useTranslation();
  const wizard = useCustomizationWizard({ product, initialDraft, language, t });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void wizard.submit();
  }

  return (
    <section id="personalizadas" className="customization-section">
      <form
        className="customization-shell"
        noValidate
        aria-busy={wizard.isSubmitting}
        aria-describedby="customization-flow-status"
        onSubmit={handleSubmit}
      >
        <div className="customization-main glass-panel">
          <div className="customization-form-head">
            <div>
              <p className="eyebrow">{t('custom.intro.eyebrow')}</p>
              <h2>{t('custom.intro.title')}</h2>
              <p>{t('custom.intro.copy')}</p>
              {wizard.displayProduct ? (
                <span className="customization-base">
                  {t('custom.baseProduct', { name: wizard.displayProduct.name })}
                </span>
              ) : null}
            </div>
            <div className="customization-handmade-note" aria-label={t('custom.handmadeAria')}>
              <Icon name="tuftMark" />
              <span>{t('custom.handmadeNote')}</span>
            </div>
          </div>

          <CustomizationStepProgress
            currentStep={wizard.currentStep}
            highestStep={wizard.highestStep}
            t={t}
            onStepClick={wizard.goToStep}
          />

          <section className="customization-step-card" aria-labelledby="customization-current-step">
            <p className="customization-step-count">
              {t('custom.stepCount', { current: wizard.currentStep + 1, total: steps.length })}
            </p>
            <h3 id="customization-current-step">
              {getStepQuestion(wizard.activeStep.id, wizard.draft, t)}
            </h3>
            <p>{getStepDescription(wizard.activeStep.id, wizard.draft, t)}</p>

            <CustomizationStepContent
              stepId={wizard.activeStep.id}
              draft={wizard.draft}
              summary={wizard.summary}
              recommendedStyles={wizard.recommendedStyles}
              t={t}
              onToggleIntention={wizard.toggleIntention}
              onSelectPlacement={wizard.selectPlacement}
              onUpdateDraft={wizard.updateDraft}
              onToggleColorToAvoid={wizard.toggleColorToAvoid}
            />

            <div className="customization-step-actions">
              <Button
                type="button"
                variant="ghost"
                className="customization-back-button"
                disabled={wizard.isFirstStep || wizard.isSubmitting}
                onClick={wizard.goToPreviousStep}
              >
                <Icon name="arrowRight" />
                {t('custom.back')}
              </Button>
              {wizard.isLastStep ? (
                <Button type="submit" className="customization-whatsapp-submit" disabled={wizard.isSubmitting}>
                  {wizard.isSubmitting ? t('custom.submitSaving') : t('custom.submitWhatsApp')}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="customization-next-button"
                  disabled={wizard.isSubmitting}
                  onClick={wizard.goToNextStep}
                >
                  {t('custom.next')}
                  <Icon name="arrowRight" />
                </Button>
              )}
            </div>

            <p id="customization-flow-status" className="customization-status" aria-live="polite">
              {wizard.status}
            </p>
          </section>

          <div className="customization-trust-strip" aria-label={t('custom.trustAria')}>
            <TrustItem icon="tuftMark" title={t('custom.trustHandmadeTitle')} text={t('custom.trustHandmadeText')} />
            <TrustItem icon="sparkles" title={t('custom.trustDesignTitle')} text={t('custom.trustDesignText')} />
            <TrustItem icon="favorite" title={t('custom.trustMaterialTitle')} text={t('custom.trustMaterialText')} />
          </div>
        </div>

        <CustomizationSummaryPanel
          summary={wizard.summary}
          t={t}
          onEdit={() => wizard.goToStep(0)}
        />
      </form>
    </section>
  );
}

function TrustItem({
  icon,
  title,
  text
}: {
  icon: 'tuftMark' | 'sparkles' | 'favorite';
  title: string;
  text: string;
}) {
  return (
    <div className="customization-trust-item">
      <Icon name={icon} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}
