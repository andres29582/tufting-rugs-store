import type { Translate, TranslationKey } from '../../../../shared/i18n';
import { placementOptions, steps } from './customizationWizardConfig';
import type { GuidedDraft, PlacementId, StepId } from './customizationWizardTypes';

export function getStepQuestion(stepId: StepId, draft: GuidedDraft, t: Translate): string {
  if (stepId === 'intention') {
    return t('custom.question.intention');
  }

  if (stepId === 'placement') {
    return t('custom.question.placement');
  }

  if (stepId === 'style') {
    return draft.placement
      ? t('custom.question.styleWithPlace', { place: getPlacementPreposition(draft.placement, t) })
      : t('custom.question.style');
  }

  if (stepId === 'base') {
    return t('custom.question.base');
  }

  if (stepId === 'colors') {
    return t('custom.question.colors');
  }

  if (stepId === 'reference') {
    return t('custom.question.reference');
  }

  return t('custom.question.summary');
}

export function getStepDescription(stepId: StepId, draft: GuidedDraft, t: Translate): string {
  if (stepId === 'intention') {
    return t('custom.description.intention');
  }

  if (stepId === 'placement') {
    return t('custom.description.placement');
  }

  if (stepId === 'style') {
    return t('custom.description.style');
  }

  if (stepId === 'base') {
    return t('custom.description.base');
  }

  if (stepId === 'colors') {
    return t('custom.description.colors');
  }

  if (stepId === 'reference') {
    return t('custom.description.reference');
  }

  return draft.referenceMode === 'LINK'
    ? t('custom.description.summaryWithLink')
    : t('custom.description.summary');
}

export function getStepValidationMessage(
  draft: GuidedDraft,
  stepIndex: number,
  t: Translate
): string {
  const step = steps[stepIndex];

  if (!step) {
    return '';
  }

  if (step.id === 'intention' && !draft.intentions.length) {
    return t('custom.validation.intention');
  }

  if (step.id === 'placement' && !draft.placement) {
    return t('custom.validation.placement');
  }

  if (step.id === 'style' && !draft.visualStyle) {
    return t('custom.validation.style');
  }

  if (step.id === 'base' && (!draft.shape || !draft.sizeBase)) {
    return t('custom.validation.base');
  }

  if (step.id === 'reference') {
    if (!draft.referenceMode) {
      return t('custom.validation.referenceMode');
    }

    if (draft.referenceMode === 'LINK' && !isValidUrl(draft.referenceUrl)) {
      return t('custom.validation.referenceUrl');
    }
  }

  return '';
}

export function getFirstInvalidStep(draft: GuidedDraft, t: Translate): number {
  return steps.findIndex((_, index) => Boolean(getStepValidationMessage(draft, index, t)));
}

function getPlacementPreposition(placement: PlacementId, t: Translate): string {
  const label = getOptionLabel(placementOptions, placement, t).toLowerCase();

  return placement === 'SETUP'
    ? t('custom.place.setupPrefix', { place: label })
    : t('custom.place.defaultPrefix', { place: label });
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

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
