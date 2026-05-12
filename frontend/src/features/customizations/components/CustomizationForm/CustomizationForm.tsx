import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  CustomizationDraft,
  CustomizationValidationErrors,
  Product,
  RugFormat,
  SizeCategory
} from '../../../../shared/types';
import { Button } from '../../../../shared/components/Button/Button';
import { FormField } from '../../../../shared/components/FormField/FormField';
import { Icon } from '../../../../shared/components/Icon/Icon';
import {
  createInitialCustomizationDraft,
  saveCustomizationDraft
} from '../../customizationsService';
import {
  customizationColorOptions,
  customizationFormatOptions,
  customizationSizeOptions
} from '../../customizationDraft';

type CustomizationFormProps = {
  product: Product | null;
  initialDraft?: Partial<CustomizationDraft>;
};

export function CustomizationForm({ product, initialDraft = {} }: CustomizationFormProps) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<CustomizationDraft>(() =>
    createInitialCustomizationDraft({
      productId: product ? product.id : '',
      ...initialDraft
    })
  );
  const [errors, setErrors] = useState<CustomizationValidationErrors>({});
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => getSummaryData(draft), [draft]);

  function updateDraft(patch: Partial<CustomizationDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch
    }));
  }

  function clearError(name: keyof CustomizationValidationErrors) {
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await saveCustomizationDraft(draft);

      if (!result.ok) {
        setErrors(result.errors);
        setStatus('Revisa los campos marcados para preparar tu solicitud.');
        setDraft(result.draft);
        return;
      }

      setStatus(getSuccessMessage(result.mode, result.customization.id));
      setDraft((current) => ({
        ...current,
        ...result.customization,
        referenceUrl: result.customization.designReferences[0]?.url || current.referenceUrl
      }));
      navigate('/solicitud/' + encodeURIComponent(result.customization.id));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No pudimos preparar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="personalizadas" className="customization-section">
      <div className="customization-panel glass-panel">
        <CustomizationIntro product={product} />
        <form className="customization-form" noValidate aria-busy={isSubmitting} onSubmit={handleSubmit}>
          <div className="customization-contact-grid">
            <FormField
              label="Nombre"
              name="customerName"
              placeholder="Tu nombre"
              autoComplete="name"
              value={draft.customerName}
              className="customization-field"
              error={errors.customerName || ''}
              onChange={(event) => {
                updateDraft({ customerName: event.currentTarget.value });
                clearError('customerName');
              }}
            />
            <FormField
              label="Email"
              name="customerEmail"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={draft.customerEmail}
              className="customization-field"
              error={errors.customerEmail || ''}
              onChange={(event) => {
                updateDraft({ customerEmail: event.currentTarget.value });
                clearError('customerEmail');
              }}
            />
            <FormField
              label="Teléfono"
              name="customerPhone"
              type="tel"
              placeholder="(00) 00000-0000"
              autoComplete="tel"
              value={draft.customerPhone}
              className="customization-field"
              error={errors.customerPhone || ''}
              onChange={(event) => {
                updateDraft({ customerPhone: event.currentTarget.value });
                clearError('customerPhone');
              }}
            />
          </div>
          <FormField
            as="textarea"
            label="Cuéntanos tu idea"
            name="description"
            placeholder="Forma, estilo, espacio donde irá y cualquier detalle importante."
            value={draft.description}
            className="customization-field"
            error={errors.description || ''}
            onChange={(event) => {
              updateDraft({ description: event.currentTarget.value });
              clearError('description');
            }}
          />
          <SizeSelector
            sizeCategory={draft.sizeCategory}
            format={draft.format}
            onChange={(value) => {
              updateDraft(value);
            }}
          />
          <ColorSelector
            selectedColors={draft.preferredColors}
            onChange={(preferredColors) => {
              updateDraft({ preferredColors });
              clearError('preferredColors');
            }}
          />
          <small className="customization-error" data-error-for="preferredColors" aria-live="polite">
            {errors.preferredColors || ''}
          </small>
          <div className="form-field customization-field customization-reference">
            <FormField
              label="Referencia visual"
              name="referenceUrl"
              type="url"
              placeholder="https://..."
              autoComplete="url"
              value={draft.referenceUrl}
              className="customization-field customization-reference"
              error={errors.referenceUrl || ''}
              onChange={(event) => {
                updateDraft({ referenceUrl: event.currentTarget.value });
                clearError('referenceUrl');
              }}
            />
            <small>Link opcional a una imagen, moodboard o inspiración.</small>
          </div>
          <div className="customization-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando solicitud...' : 'Preparar mi solicitud'}
            </Button>
          </div>
          <p className="customization-status" aria-live="polite">
            {status}
          </p>
        </form>
        <CustomizationSummary summary={summary} />
      </div>
    </section>
  );
}

function CustomizationIntro({ product }: { product: Product | null }) {
  return (
    <div className="customization-intro">
      <div className="magic-icon" aria-hidden="true">
        <Icon name="sparkles" />
      </div>
      <p className="eyebrow">Pedido personalizado</p>
      <h2>Dale forma a tu alfombra</h2>
      <p>Comparte tu idea, colores y medidas para preparar una propuesta visual hecha a mano.</p>
      {product ? <span className="customization-base">Base creativa: {product.name}</span> : null}
    </div>
  );
}

type SizeSelectorProps = {
  sizeCategory: SizeCategory;
  format: RugFormat;
  onChange: (value: Pick<CustomizationDraft, 'sizeCategory' | 'sizeLabel' | 'format'>) => void;
};

function SizeSelector({ sizeCategory, format, onChange }: SizeSelectorProps) {
  const selectedSize =
    customizationSizeOptions.find((option) => option.sizeCategory === sizeCategory) ||
    customizationSizeOptions[1];

  return (
    <div className="customization-size-format">
      <fieldset className="customization-field">
        <legend>Tamaño</legend>
        <div className="customization-option-grid">
          {customizationSizeOptions.map((option) => (
            <button
              type="button"
              className="customization-choice"
              data-size-category={option.sizeCategory}
              aria-pressed={option.sizeCategory === sizeCategory}
              key={option.sizeCategory}
              onClick={() => {
                onChange({
                  sizeCategory: option.sizeCategory,
                  sizeLabel: option.sizeLabel,
                  format
                });
              }}
            >
              <strong>{option.label}</strong>
              <span>{option.detail}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="customization-field">
        <legend>Formato</legend>
        <div className="customization-format-grid">
          {customizationFormatOptions.map((option) => (
            <button
              type="button"
              className="customization-format"
              data-format={option.value}
              aria-pressed={option.value === format}
              key={option.value}
              onClick={() => {
                onChange({
                  sizeCategory,
                  sizeLabel: selectedSize.sizeLabel,
                  format: option.value
                });
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

type ColorSelectorProps = {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
};

function ColorSelector({ selectedColors, onChange }: ColorSelectorProps) {
  const selectedColorSet = new Set(selectedColors);

  function toggleColor(color: string) {
    const nextColors = selectedColorSet.has(color)
      ? selectedColors.filter((selectedColor) => selectedColor !== color)
      : [...selectedColors, color];

    onChange(nextColors);
  }

  return (
    <fieldset className="customization-field customization-colors">
      <legend>Colores principales</legend>
      <div className="customization-color-grid">
        {customizationColorOptions.map((color) => (
          <button
            type="button"
            className="customization-color-option"
            data-color={color.value}
            style={{ '--swatch-color': color.value } as React.CSSProperties}
            aria-label={color.name}
            aria-pressed={selectedColorSet.has(color.value)}
            key={color.value}
            onClick={() => toggleColor(color.value)}
          >
            <span aria-hidden="true" />
            <strong>{color.name}</strong>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type SummaryData = {
  title: string;
  description: string;
  sizeLabel: string;
  formatLabel: string;
  hasReference: boolean;
  colors: string[];
};

function CustomizationSummary({ summary }: { summary: SummaryData }) {
  return (
    <aside className="customization-summary" aria-label="Resumen de personalización">
      <p className="eyebrow">Resumen</p>
      <h3>{summary.title}</h3>
      <p>{summary.description}</p>
      <dl className="customization-summary-list">
        <dt>Tamaño</dt>
        <dd>{summary.sizeLabel}</dd>
        <dt>Formato</dt>
        <dd>{summary.formatLabel}</dd>
        <dt>Referencia</dt>
        <dd>{summary.hasReference ? 'Incluida' : 'Opcional'}</dd>
      </dl>
      <div className="customization-summary-colors">
        {summary.colors.map((color) => (
          <span style={{ '--swatch-color': color } as React.CSSProperties} aria-label={color} key={color} />
        ))}
      </div>
    </aside>
  );
}

function getSummaryData(draft: CustomizationDraft): SummaryData {
  return {
    title: draft.description ? 'Idea en progreso' : 'Tu idea empieza aquí',
    description: draft.description || 'Describe la alfombra que quieres crear.',
    sizeLabel: draft.sizeLabel || 'A medida',
    formatLabel: getFormatLabel(draft.format),
    hasReference: Boolean(draft.referenceUrl),
    colors: draft.preferredColors
  };
}

function getFormatLabel(format: RugFormat): string {
  const option = customizationFormatOptions.find((item) => item.value === format);

  return option ? option.label : 'Libre';
}

function getSuccessMessage(mode: 'api' | 'mock', customizationId: string): string {
  if (mode === 'api') {
    return customizationId
      ? 'Personalización enviada. ID: ' + customizationId + '. Pronto recibirás una propuesta.'
      : 'Personalización enviada. Revisaremos tu idea para preparar la propuesta.';
  }

  return 'Personalización preparada. El siguiente paso será confirmar el pedido.';
}
