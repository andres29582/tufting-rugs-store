import { describe, expect, it } from 'vitest';
import type { Translate } from '../../../../shared/i18n';
import { translations, type TranslationKey } from '../../../../shared/i18n/translations';
import { buildProduct } from '../../../../shared/test/builders';
import { getRecommendedStyles, steps } from './customizationWizardConfig';
import { getFirstInvalidStep, getStepValidationMessage } from './customizationWizardCopy';
import { buildSummary } from './customizationWizardSummary';
import { buildWhatsAppUrl } from './whatsappMessage';
import { buildCustomizationDraftFromWizard } from './customizationWizardDraft';
import type { GuidedDraft, StepId } from './customizationWizardTypes';

const t: Translate = (key, params = {}) =>
  Object.entries(params).reduce(
    (message, [name, value]) => message.replaceAll('{' + name + '}', String(value)),
    translations.es[key]
  );

const validDraft: GuidedDraft = {
  intentions: ['ELEGANT'],
  placement: 'SETUP',
  visualStyle: 'NEON',
  shape: 'FREE',
  sizeBase: '60X60',
  colorsToAvoid: ['WHITE'],
  referenceMode: 'LINK',
  referenceUrl: 'https://example.com/reference.png',
};

describe('customizationWizard', () => {
  it('recommends default and placement-specific visual styles', () => {
    expect(getRecommendedStyles('').map((option) => option.value)).toEqual([
      'MINIMAL',
      'ORGANIC',
      'GEOMETRIC',
      'SOFT',
    ]);
    expect(getRecommendedStyles('SETUP').map((option) => option.value)).toEqual([
      'NEON',
      'CHARACTER',
      'PLAYFUL',
    ]);
  });

  it('validates required steps and unsafe reference links', () => {
    expect(getFirstInvalidStep({ ...validDraft, intentions: [] }, t)).toBe(
      getStepIndex('intention')
    );
    expect(getFirstInvalidStep({ ...validDraft, shape: '' }, t)).toBe(getStepIndex('base'));
    expect(
      getStepValidationMessage(
        { ...validDraft, referenceUrl: 'ftp://example.com/reference.png' },
        getStepIndex('reference'),
        t
      )
    ).toBe(translations.es['custom.validation.referenceUrl']);
  });

  it('builds localized summaries and WhatsApp messages from the guided draft', () => {
    const product = buildProduct({ name: 'Base premium' });
    const summary = buildSummary(validDraft, product, t, 'RUG-20260526-TEST');

    expect(summary).toMatchObject({
      requestId: 'RUG-20260526-TEST',
      intention: 'Elegante',
      placement: 'Setup',
      visualStyle: 'Gamer neon',
      shape: 'Forma libre',
      sizeBase: '60 x 60 cm',
      colorsToAvoid: 'Blanco',
      reference: 'https://example.com/reference.png',
    });
    expect(summary.whatsappMessage).not.toContain('Nombre:');
    expect(summary.whatsappMessage).not.toContain('Email:');
    expect(summary.whatsappMessage).not.toContain('WhatsApp:');
    expect(summary.whatsappMessage).toContain('Código RUG: RUG-20260526-TEST');
    expect(summary.whatsappMessage).toContain('Origen: Personalización manual');
    expect(summary.whatsappMessage).toContain('Base de inspiración: Base premium');
    expect(summary.whatsappMessage).toContain(
      'Referencia visual: https://example.com/reference.png'
    );
    expect(summary.whatsappMessage).toContain(
      'Solicitud: Validar viabilidad, plazo de producción y presupuesto final por WhatsApp.'
    );
    expect(decodeURIComponent(buildWhatsAppUrl(summary).split('?text=')[1] || '')).toBe(
      summary.whatsappMessage
    );
  });

  it('keeps optional colors and reference readable in the final summary', () => {
    const summary = buildSummary(
      {
        ...validDraft,
        colorsToAvoid: [],
        referenceMode: 'NONE',
        referenceUrl: '',
      },
      null,
      t
    );

    expect(summary.colorsToAvoid).toBe(translations.es['custom.colors.noRestrictions']);
    expect(summary.reference).toBe(translations.es['custom.reference.none']);
    expect(summary.whatsappMessage).toContain(
      'Base de inspiración: Alfombra 100% personalizada'
    );
  });

  it('maps guided answers to the backend customization draft contract', () => {
    const product = buildProduct({ id: 'custom-product', name: 'Base premium' });
    const summary = buildSummary(validDraft, product, t);
    const draft = buildCustomizationDraftFromWizard(validDraft, summary, product, t);

    expect(draft).toMatchObject({
      productId: 'custom-product',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      preferredColors: [],
      sizeCategory: 'MEDIUM',
      sizeLabel: '60 x 60 cm',
      format: 'CUSTOM',
      referenceUrl: 'https://example.com/reference.png',
    });
    expect(draft.description).toContain('Brief guiado de alfombra personalizada');
    expect(draft.description).toContain('Producto base');
    expect(draft.description).toContain('Nombre: Base premium');
    expect(draft.description).toContain('Formato técnico: CUSTOM');
    expect(draft.description).not.toContain('Contacto');
    expect(draft.description).toContain('Colores a evitar: Blanco');
  });
});

function getStepIndex(stepId: StepId): number {
  return steps.findIndex((step) => step.id === stepId);
}
