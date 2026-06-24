import type { Translate } from '../../../../shared/i18n';
import { steps } from './customizationWizardConfig';

type CustomizationStepProgressProps = {
  currentStep: number;
  highestStep: number;
  t: Translate;
  onStepClick: (stepIndex: number) => void;
};

export function CustomizationStepProgress({
  currentStep,
  highestStep,
  t,
  onStepClick,
}: CustomizationStepProgressProps) {
  return (
    <nav className="customization-stepper" aria-label={t('custom.progressAria')}>
      {steps.map((step, index) => {
        const state =
          index === currentStep ? 'active' : index < currentStep ? 'complete' : 'upcoming';
        const canVisit = index <= highestStep;

        return (
          <button
            key={step.id}
            type="button"
            className="customization-stepper-item"
            data-state={state}
            aria-current={index === currentStep ? 'step' : undefined}
            disabled={!canVisit}
            onClick={() => onStepClick(index)}
          >
            <span>{index + 1}</span>
            <strong>{t(step.shortLabelKey)}</strong>
          </button>
        );
      })}
    </nav>
  );
}
