import type {
  ChoiceOption,
  ColorAvoidOption,
  IntentionId,
  PlacementId,
  PlacementOption,
  ReferenceOption,
  ShapeOption,
  SizeBaseId,
  SizeBaseOption,
  StepDefinition,
  VisualStyleOption
} from './customizationWizardTypes';

export const steps: StepDefinition[] = [
  { id: 'intention', labelKey: 'custom.step.intention', shortLabelKey: 'custom.step.intention' },
  { id: 'placement', labelKey: 'custom.step.placement', shortLabelKey: 'custom.step.useShort' },
  { id: 'style', labelKey: 'custom.step.style', shortLabelKey: 'custom.step.styleShort' },
  { id: 'base', labelKey: 'custom.step.base', shortLabelKey: 'custom.step.baseShort' },
  { id: 'colors', labelKey: 'custom.step.colors', shortLabelKey: 'custom.step.colorsShort' },
  { id: 'reference', labelKey: 'custom.step.reference', shortLabelKey: 'custom.step.reference' },
  { id: 'summary', labelKey: 'custom.step.summary', shortLabelKey: 'custom.step.summary' }
];

export const intentionOptions: ChoiceOption<IntentionId>[] = [
  {
    value: 'ELEGANT',
    labelKey: 'custom.intention.elegant.label',
    detailKey: 'custom.intention.elegant.detail',
    marker: '01'
  },
  {
    value: 'FAMILIAR',
    labelKey: 'custom.intention.familiar.label',
    detailKey: 'custom.intention.familiar.detail',
    marker: '02'
  },
  {
    value: 'FUN',
    labelKey: 'custom.intention.fun.label',
    detailKey: 'custom.intention.fun.detail',
    marker: '03'
  },
  {
    value: 'MODERN',
    labelKey: 'custom.intention.modern.label',
    detailKey: 'custom.intention.modern.detail',
    marker: '04'
  },
  {
    value: 'GAMER',
    labelKey: 'custom.intention.gamer.label',
    detailKey: 'custom.intention.gamer.detail',
    marker: '05'
  },
  {
    value: 'KIDS',
    labelKey: 'custom.intention.kids.label',
    detailKey: 'custom.intention.kids.detail',
    marker: '06'
  }
];

export const placementOptions: PlacementOption[] = [
  {
    value: 'LIVING',
    labelKey: 'custom.placement.living.label',
    detailKey: 'custom.placement.living.detail',
    marker: 'SL'
  },
  {
    value: 'BEDROOM',
    labelKey: 'custom.placement.bedroom.label',
    detailKey: 'custom.placement.bedroom.detail',
    marker: 'CT'
  },
  {
    value: 'ENTRY',
    labelKey: 'custom.placement.entry.label',
    detailKey: 'custom.placement.entry.detail',
    marker: 'EN'
  },
  {
    value: 'SETUP',
    labelKey: 'custom.placement.setup.label',
    detailKey: 'custom.placement.setup.detail',
    marker: 'ST'
  },
  {
    value: 'BUSINESS',
    labelKey: 'custom.placement.business.label',
    detailKey: 'custom.placement.business.detail',
    marker: 'NG'
  },
  {
    value: 'GIFT',
    labelKey: 'custom.placement.gift.label',
    detailKey: 'custom.placement.gift.detail',
    marker: 'RG'
  }
];

export const visualStyleOptions: VisualStyleOption[] = [
  {
    value: 'MINIMAL',
    labelKey: 'custom.style.minimal.label',
    detailKey: 'custom.style.minimal.detail',
    marker: 'MN',
    placements: ['LIVING', 'BEDROOM', 'BUSINESS']
  },
  {
    value: 'ORGANIC',
    labelKey: 'custom.style.organic.label',
    detailKey: 'custom.style.organic.detail',
    marker: 'OR',
    placements: ['LIVING', 'BEDROOM', 'GIFT']
  },
  {
    value: 'GEOMETRIC',
    labelKey: 'custom.style.geometric.label',
    detailKey: 'custom.style.geometric.detail',
    marker: 'GM',
    placements: ['LIVING', 'ENTRY', 'BUSINESS']
  },
  {
    value: 'SOFT',
    labelKey: 'custom.style.soft.label',
    detailKey: 'custom.style.soft.detail',
    marker: 'SV',
    placements: ['BEDROOM', 'GIFT']
  },
  {
    value: 'NEON',
    labelKey: 'custom.style.neon.label',
    detailKey: 'custom.style.neon.detail',
    marker: 'GN',
    placements: ['SETUP']
  },
  {
    value: 'CHARACTER',
    labelKey: 'custom.style.character.label',
    detailKey: 'custom.style.character.detail',
    marker: 'PJ',
    placements: ['SETUP', 'GIFT', 'BEDROOM']
  },
  {
    value: 'LOGO',
    labelKey: 'custom.style.logo.label',
    detailKey: 'custom.style.logo.detail',
    marker: 'LG',
    placements: ['BUSINESS', 'ENTRY', 'GIFT']
  },
  {
    value: 'PLAYFUL',
    labelKey: 'custom.style.playful.label',
    detailKey: 'custom.style.playful.detail',
    marker: 'CL',
    placements: ['GIFT', 'SETUP', 'LIVING']
  }
];

export const shapeOptions: ShapeOption[] = [
  {
    value: 'RECTANGULAR',
    labelKey: 'custom.shape.rectangular.label',
    detailKey: 'custom.shape.rectangular.detail',
    marker: 'RC',
    format: 'RECTANGULAR'
  },
  {
    value: 'ROUND',
    labelKey: 'custom.shape.round.label',
    detailKey: 'custom.shape.round.detail',
    marker: 'CR',
    format: 'ROUND'
  },
  {
    value: 'FREE',
    labelKey: 'custom.shape.free.label',
    detailKey: 'custom.shape.free.detail',
    marker: 'FL',
    format: 'CUSTOM'
  }
];

export const sizeBaseOptions: SizeBaseOption[] = [
  {
    value: '40X40',
    label: '40x40',
    detailKey: 'custom.size.compact',
    sizeLabel: '40 x 40 cm',
    sizeCategory: 'SMALL'
  },
  {
    value: '60X60',
    label: '60x60',
    detailKey: 'custom.size.medium',
    sizeLabel: '60 x 60 cm',
    sizeCategory: 'MEDIUM'
  }
];

export const colorAvoidOptions: ColorAvoidOption[] = [
  { value: 'WHITE', labelKey: 'custom.color.white', swatch: '#fffaf3' },
  { value: 'BEIGE', labelKey: 'custom.color.beige', swatch: '#d8c1a5' },
  { value: 'PINK', labelKey: 'custom.color.pink', swatch: '#db5c91' },
  { value: 'RED', labelKey: 'custom.color.red', swatch: '#d63637' },
  { value: 'ORANGE', labelKey: 'custom.color.orange', swatch: '#f97316' },
  { value: 'YELLOW', labelKey: 'custom.color.yellow', swatch: '#f5c542' },
  { value: 'GREEN', labelKey: 'custom.color.green', swatch: '#3f7d44' },
  { value: 'BLUE', labelKey: 'custom.color.blue', swatch: '#1d2b53' },
  { value: 'PURPLE', labelKey: 'custom.color.purple', swatch: '#7c3aed' },
  { value: 'BLACK', labelKey: 'custom.color.black', swatch: '#111111' }
];

export const referenceOptions: ReferenceOption[] = [
  {
    value: 'LINK',
    labelKey: 'custom.reference.link.label',
    detailKey: 'custom.reference.link.detail',
    marker: 'LK'
  },
  {
    value: 'NONE',
    labelKey: 'custom.reference.none.label',
    detailKey: 'custom.reference.none.detail',
    marker: 'NR'
  }
];

export function getRecommendedStyles(placement: PlacementId | ''): VisualStyleOption[] {
  if (!placement) {
    return visualStyleOptions.slice(0, 4);
  }

  const recommended = visualStyleOptions.filter((option) => option.placements.includes(placement));

  return recommended.length ? recommended : visualStyleOptions.slice(0, 4);
}

export function getSelectedSize(value: SizeBaseId | ''): SizeBaseOption | null {
  return sizeBaseOptions.find((option) => option.value === value) || null;
}
