import type { CSSProperties, ReactNode } from 'react';
import type { Translate } from '../../../../shared/i18n';
import { FormField } from '../../../../shared/components/FormField/FormField';
import {
  colorAvoidOptions,
  intentionOptions,
  placementOptions,
  referenceOptions,
  shapeOptions,
  sizeBaseOptions
} from './customizationWizardConfig';
import { SummaryItem } from './CustomizationSummaryItem';
import type {
  ChoiceOption,
  ColorAvoidId,
  CustomizationSummary,
  GuidedDraft,
  IntentionId,
  PlacementId,
  StepId,
  VisualStyleOption
} from './customizationWizardTypes';

type CustomizationStepContentProps = {
  stepId: StepId;
  draft: GuidedDraft;
  summary: CustomizationSummary;
  recommendedStyles: VisualStyleOption[];
  t: Translate;
  onToggleIntention: (intention: IntentionId) => void;
  onSelectPlacement: (placement: PlacementId) => void;
  onUpdateDraft: (patch: Partial<GuidedDraft>) => void;
  onToggleColorToAvoid: (color: ColorAvoidId) => void;
};

export function CustomizationStepContent({
  stepId,
  draft,
  summary,
  recommendedStyles,
  t,
  onToggleIntention,
  onSelectPlacement,
  onUpdateDraft,
  onToggleColorToAvoid
}: CustomizationStepContentProps) {
  if (stepId === 'intention') {
    return (
      <ChoiceGrid legend={t('custom.group.intention')}>
        {intentionOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            option={option}
            t={t}
            selected={draft.intentions.includes(option.value)}
            onClick={() => onToggleIntention(option.value)}
          />
        ))}
      </ChoiceGrid>
    );
  }

  if (stepId === 'placement') {
    return (
      <ChoiceGrid legend={t('custom.group.placement')}>
        {placementOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            option={option}
            t={t}
            selected={draft.placement === option.value}
            onClick={() => onSelectPlacement(option.value)}
          />
        ))}
      </ChoiceGrid>
    );
  }

  if (stepId === 'style') {
    return (
      <ChoiceGrid legend={t('custom.group.styles')}>
        {recommendedStyles.map((option) => (
          <ChoiceCard
            key={option.value}
            option={option}
            t={t}
            selected={draft.visualStyle === option.value}
            onClick={() => onUpdateDraft({ visualStyle: option.value })}
          />
        ))}
      </ChoiceGrid>
    );
  }

  if (stepId === 'base') {
    return (
      <div className="customization-base-grid">
        <ChoiceGrid legend={t('custom.group.shape')}>
          {shapeOptions.map((option) => (
            <ChoiceCard
              key={option.value}
              option={option}
              t={t}
              selected={draft.shape === option.value}
              onClick={() => onUpdateDraft({ shape: option.value })}
            />
          ))}
        </ChoiceGrid>
        <fieldset className="customization-fieldset">
          <legend>{t('custom.group.size')}</legend>
          <div className="customization-size-grid">
            {sizeBaseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="customization-size-option"
                aria-pressed={draft.sizeBase === option.value}
                onClick={() => onUpdateDraft({ sizeBase: option.value })}
              >
                <strong>{option.label}</strong>
                <span>{t(option.detailKey)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  if (stepId === 'colors') {
    return (
      <fieldset className="customization-fieldset">
        <legend>{t('custom.group.colors')}</legend>
        <div className="customization-color-grid">
          {colorAvoidOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="customization-color-option"
              aria-pressed={draft.colorsToAvoid.includes(option.value)}
              style={{ '--swatch-color': option.swatch } as CSSProperties}
              onClick={() => onToggleColorToAvoid(option.value)}
            >
              <span aria-hidden="true" />
              <strong>{t(option.labelKey)}</strong>
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if (stepId === 'reference') {
    return (
      <div className="customization-reference-step">
        <ChoiceGrid legend={t('custom.group.reference')}>
          {referenceOptions.map((option) => (
            <ChoiceCard
              key={option.value}
              option={option}
              t={t}
              selected={draft.referenceMode === option.value}
              onClick={() =>
                onUpdateDraft({
                  referenceMode: option.value,
                  referenceUrl: option.value === 'NONE' ? '' : draft.referenceUrl
                })
              }
            />
          ))}
        </ChoiceGrid>
        {draft.referenceMode === 'LINK' ? (
          <FormField
            label={t('custom.referenceInput')}
            name="referenceUrl"
            type="url"
            placeholder={t('custom.referencePlaceholder')}
            autoComplete="url"
            value={draft.referenceUrl}
            className="customization-reference-input"
            onChange={(event) => onUpdateDraft({ referenceUrl: event.currentTarget.value })}
          />
        ) : null}
      </div>
    );
  }

  return <SummaryStep summary={summary} />;
}

function ChoiceGrid({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="customization-fieldset">
      <legend>{legend}</legend>
      <div className="customization-choice-grid">{children}</div>
    </fieldset>
  );
}

function ChoiceCard<T extends string>({
  option,
  t,
  selected,
  onClick
}: {
  option: ChoiceOption<T>;
  t: Translate;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="customization-choice-card"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="customization-choice-card__marker" aria-hidden="true">
        {option.marker}
      </span>
      <span className="customization-choice-card__check" aria-hidden="true" />
      <strong>{t(option.labelKey)}</strong>
      <span>{t(option.detailKey)}</span>
    </button>
  );
}

function SummaryStep({ summary }: { summary: CustomizationSummary }) {
  return (
    <div className="customization-final-summary">
      <dl>
        <SummaryItem label={summary.labels.intention} value={summary.intention} />
        <SummaryItem label={summary.labels.use} value={summary.placement} />
        <SummaryItem label={summary.labels.style} value={summary.visualStyle} />
        <SummaryItem label={summary.labels.shape} value={summary.shape} />
        <SummaryItem label={summary.labels.size} value={summary.sizeBase} />
        <SummaryItem label={summary.labels.colorsAvoid} value={summary.colorsToAvoid} />
        <SummaryItem label={summary.labels.reference} value={summary.reference} />
      </dl>
    </div>
  );
}
