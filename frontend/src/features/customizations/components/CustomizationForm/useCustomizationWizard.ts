import { useMemo, useState } from 'react';
import type { CustomizationDraft, Product } from '../../../../shared/types';
import type { Language, Translate } from '../../../../shared/i18n';
import { localizeProduct } from '../../../products/productLocalization';
import {
  getRecommendedStyles,
  shapeOptions,
  sizeBaseOptions,
  steps
} from './customizationWizardConfig';
import { getFirstInvalidStep, getStepValidationMessage } from './customizationWizardCopy';
import { buildSummary } from './customizationWizardSummary';
import { buildWhatsAppUrl } from './whatsappMessage';
import type {
  ColorAvoidId,
  GuidedDraft,
  IntentionId,
  PlacementId
} from './customizationWizardTypes';

type UseCustomizationWizardParams = {
  product: Product | null;
  initialDraft: Partial<CustomizationDraft>;
  language: Language;
  t: Translate;
};

export function useCustomizationWizard({
  product,
  initialDraft,
  language,
  t
}: UseCustomizationWizardParams) {
  const [draft, setDraft] = useState<GuidedDraft>(() => createInitialGuidedDraft(initialDraft));
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId] = useState(() => generateLocalRugCode());

  const recommendedStyles = useMemo(
    () => getRecommendedStyles(draft.placement),
    [draft.placement]
  );
  const displayProduct = useMemo(
    () => (product ? localizeProduct(product, language) : null),
    [language, product]
  );
  const summary = useMemo(
    () => buildSummary(draft, displayProduct, t, requestId),
    [draft, displayProduct, requestId, t]
  );
  const activeStep = steps[currentStep] || steps[0]!;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function updateDraft(patch: Partial<GuidedDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch
    }));
    setStatus('');
  }

  function toggleIntention(intention: IntentionId) {
    setDraft((current) => ({
      ...current,
      intentions: current.intentions.includes(intention)
        ? current.intentions.filter((item) => item !== intention)
        : [...current.intentions, intention]
    }));
    setStatus('');
  }

  function toggleColorToAvoid(color: ColorAvoidId) {
    setDraft((current) => ({
      ...current,
      colorsToAvoid: current.colorsToAvoid.includes(color)
        ? current.colorsToAvoid.filter((item) => item !== color)
        : [...current.colorsToAvoid, color]
    }));
    setStatus('');
  }

  function selectPlacement(placement: PlacementId) {
    const nextRecommendedStyles = getRecommendedStyles(placement);

    setDraft((current) => ({
      ...current,
      placement,
      visualStyle: nextRecommendedStyles.some((option) => option.value === current.visualStyle)
        ? current.visualStyle
        : ''
    }));
    setStatus('');
  }

  function goToStep(stepIndex: number) {
    if (stepIndex <= highestStep) {
      setCurrentStep(stepIndex);
      setStatus('');
    }
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(0, step - 1));
    setStatus('');
  }

  function goToNextStep() {
    const validationMessage = getStepValidationMessage(draft, currentStep, t);

    if (validationMessage) {
      setStatus(validationMessage);
      return;
    }

    const nextStep = Math.min(steps.length - 1, currentStep + 1);
    setCurrentStep(nextStep);
    setHighestStep((step) => Math.max(step, nextStep));
    setStatus('');
  }

  async function submit() {
    if (isSubmitting) {
      return;
    }

    if (!isLastStep) {
      goToNextStep();
      return;
    }

    const firstInvalidStep = getFirstInvalidStep(draft, t);

    if (firstInvalidStep >= 0) {
      setCurrentStep(firstInvalidStep);
      setStatus(getStepValidationMessage(draft, firstInvalidStep, t));
      return;
    }

    setIsSubmitting(true);
    setStatus(t('custom.statusWhatsAppOpened'));

    try {
      window.open(buildWhatsAppUrl(summary), '_blank', 'noopener,noreferrer');
      setStatus(t('custom.statusWhatsAppOpened'));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t('custom.statusLeadSaveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    activeStep,
    currentStep,
    displayProduct,
    draft,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    highestStep,
    isSubmitting,
    isFirstStep,
    isLastStep,
    recommendedStyles,
    selectPlacement,
    status,
    submit,
    summary,
    toggleColorToAvoid,
    toggleIntention,
    updateDraft
  };
}

function createInitialGuidedDraft(initialDraft: Partial<CustomizationDraft>): GuidedDraft {
  const initialShape = shapeOptions.find((option) => option.format === initialDraft.format)?.value || '';
  const initialSize =
    sizeBaseOptions.find((option) => option.sizeLabel === initialDraft.sizeLabel)?.value ||
    sizeBaseOptions.find((option) => option.sizeCategory === initialDraft.sizeCategory)?.value ||
    '';

  return {
    intentions: [],
    placement: '',
    visualStyle: '',
    shape: initialShape,
    sizeBase: initialSize,
    colorsToAvoid: [],
    referenceMode: initialDraft.referenceUrl ? 'LINK' : '',
    referenceUrl: initialDraft.referenceUrl || '',
    customerName: initialDraft.customerName || '',
    customerEmail: initialDraft.customerEmail || '',
    customerPhone: initialDraft.customerPhone || ''
  };
}

function generateLocalRugCode(date = new Date()): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(4);

  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  const suffix = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('');

  return 'RUG-' + datePart + '-' + suffix;
}
