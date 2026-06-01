import type { RugFormat, SizeCategory } from '../../../../shared/types';
import type { TranslationKey } from '../../../../shared/i18n';

export type StepId =
  | 'intention'
  | 'placement'
  | 'style'
  | 'base'
  | 'colors'
  | 'reference'
  | 'summary';
export type IntentionId = 'ELEGANT' | 'FAMILIAR' | 'FUN' | 'MODERN' | 'GAMER' | 'KIDS';
export type PlacementId = 'LIVING' | 'BEDROOM' | 'ENTRY' | 'SETUP' | 'BUSINESS' | 'GIFT';
export type VisualStyleId =
  | 'MINIMAL'
  | 'ORGANIC'
  | 'GEOMETRIC'
  | 'SOFT'
  | 'NEON'
  | 'CHARACTER'
  | 'LOGO'
  | 'PLAYFUL';
export type ShapeId = 'RECTANGULAR' | 'ROUND' | 'FREE';
export type SizeBaseId = '40X40' | '60X60';
export type ColorAvoidId =
  | 'WHITE'
  | 'BEIGE'
  | 'PINK'
  | 'RED'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE'
  | 'PURPLE'
  | 'BLACK';
export type ReferenceMode = 'LINK' | 'NONE';

export type GuidedDraft = {
  intentions: IntentionId[];
  placement: PlacementId | '';
  visualStyle: VisualStyleId | '';
  shape: ShapeId | '';
  sizeBase: SizeBaseId | '';
  colorsToAvoid: ColorAvoidId[];
  referenceMode: ReferenceMode | '';
  referenceUrl: string;
};

export type StepDefinition = {
  id: StepId;
  labelKey: TranslationKey;
  shortLabelKey: TranslationKey;
};

export type ChoiceOption<T extends string> = {
  value: T;
  labelKey: TranslationKey;
  detailKey: TranslationKey;
  marker: string;
};

export type PlacementOption = ChoiceOption<PlacementId>;
export type VisualStyleOption = ChoiceOption<VisualStyleId> & {
  placements: PlacementId[];
};
export type ShapeOption = ChoiceOption<ShapeId> & {
  format: RugFormat;
};
export type SizeBaseOption = {
  value: SizeBaseId;
  label: string;
  detailKey: TranslationKey;
  sizeLabel: string;
  sizeCategory: SizeCategory;
};
export type ColorAvoidOption = {
  value: ColorAvoidId;
  labelKey: TranslationKey;
  swatch: string;
};
export type ReferenceOption = ChoiceOption<ReferenceMode>;

export type CustomizationSummary = {
  labels: {
    intention: string;
    use: string;
    style: string;
    shape: string;
    size: string;
    colorsAvoid: string;
    reference: string;
  };
  intention: string;
  placement: string;
  visualStyle: string;
  shape: string;
  sizeBase: string;
  colorsToAvoid: string;
  reference: string;
  referenceUrl: string;
  requestId: string;
  whatsappMessage: string;
};
