import {
  createInitialCustomizationDraft,
  saveCustomizationDraft
} from '../../customizationsService.js';
import { customizationFormatOptions } from '../../customizationDraft.js';
import { renderColorSelector } from '../ColorSelector/ColorSelector.js';
import { renderReferenceUploader } from '../ReferenceUploader/ReferenceUploader.js';
import { renderSizeSelector } from '../SizeSelector/SizeSelector.js';
import { renderButton } from '../../../../shared/components/Button/Button.js';
import { renderFormField } from '../../../../shared/components/FormField/FormField.js';
import { renderIcon } from '../../../../shared/components/Icon/Icon.js';

export function renderCustomizationForm(options = {}) {
  let draft = createInitialCustomizationDraft({
    productId: options.product ? options.product.id : '',
    ...options.initialDraft
  });

  const section = document.createElement('section');
  section.id = 'personalizadas';
  section.className = 'customization-section';

  const panel = document.createElement('div');
  panel.className = 'customization-panel glass-panel';

  const intro = renderIntro(options.product);
  const form = document.createElement('form');
  form.className = 'customization-form';
  form.noValidate = true;

  const summary = renderSummary(draft);
  const status = document.createElement('p');
  status.className = 'customization-status';
  status.setAttribute('aria-live', 'polite');

  const nameField = renderFormField({
    label: 'Nombre',
    name: 'customerName',
    placeholder: 'Tu nombre',
    autocomplete: 'name',
    value: draft.customerName,
    className: 'customization-field'
  });
  const emailField = renderFormField({
    label: 'Email',
    name: 'customerEmail',
    type: 'email',
    placeholder: 'tu@email.com',
    autocomplete: 'email',
    value: draft.customerEmail,
    className: 'customization-field'
  });
  const phoneField = renderFormField({
    label: 'Teléfono',
    name: 'customerPhone',
    type: 'tel',
    placeholder: '(00) 00000-0000',
    autocomplete: 'tel',
    value: draft.customerPhone,
    className: 'customization-field'
  });
  const ideaField = renderFormField({
    as: 'textarea',
    label: 'Cuéntanos tu idea',
    name: 'description',
    placeholder: 'Forma, estilo, espacio donde irá y cualquier detalle importante.',
    value: draft.description,
    className: 'customization-field'
  });
  const fields = {
    customerName: nameField,
    customerEmail: emailField,
    customerPhone: phoneField,
    description: ideaField
  };

  const sizeSelector = renderSizeSelector({
    sizeCategory: draft.sizeCategory,
    sizeLabel: draft.sizeLabel,
    format: draft.format,
    onChange: function (value) {
      draft = {
        ...draft,
        ...value
      };
      syncSummary(summary, draft);
    }
  });
  const colorSelector = renderColorSelector({
    selectedColors: draft.preferredColors,
    onChange: function (colors) {
      draft = {
        ...draft,
        preferredColors: colors
      };
      syncSummary(summary, draft);
    }
  });
  const referenceUploader = renderReferenceUploader({
    value: draft.referenceUrl,
    onChange: function (referenceUrl) {
      draft = {
        ...draft,
        referenceUrl
      };
      syncSummary(summary, draft);
    }
  });
  fields.referenceUrl = referenceUploader;

  const contactGrid = document.createElement('div');
  contactGrid.className = 'customization-contact-grid';
  contactGrid.appendChild(nameField.element);
  contactGrid.appendChild(emailField.element);
  contactGrid.appendChild(phoneField.element);

  const colorError = renderError('preferredColors');
  const actions = document.createElement('div');
  actions.className = 'customization-actions';

  const submit = renderButton({
    label: 'Preparar mi solicitud',
    type: 'submit',
    variant: 'primary'
  });

  actions.appendChild(submit.element);

  form.appendChild(contactGrid);
  form.appendChild(ideaField.element);
  form.appendChild(sizeSelector.element);
  form.appendChild(colorSelector.element);
  form.appendChild(colorError);
  form.appendChild(referenceUploader.element);
  form.appendChild(actions);
  form.appendChild(status);

  form.addEventListener('input', function (event) {
    const target = event.target;

    if (!target.name) {
      return;
    }

    draft = {
      ...draft,
      [target.name]: target.value
    };
    clearFieldError(fields, form, target.name);
    syncSummary(summary, draft);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    status.textContent = '';
    clearErrors(fields, form);
    submit.element.disabled = true;
    submit.setLabel('Enviando solicitud...');
    form.setAttribute('aria-busy', 'true');

    try {
      const result = await saveCustomizationDraft(draft);

      if (!result.ok) {
        showErrors(fields, form, result.errors);
        status.textContent = 'Revisa los campos marcados para preparar tu solicitud.';
        draft = result.draft;
        syncSummary(summary, draft);
        return;
      }

      status.textContent = getSuccessMessage(result);
      syncSummary(summary, result.customization);
      redirectToSuccessPage(result.customization);
    } catch (error) {
      status.textContent = error.message || 'No pudimos preparar la solicitud.';
    } finally {
      submit.element.disabled = false;
      submit.setLabel('Preparar mi solicitud');
      form.removeAttribute('aria-busy');
    }
  });

  panel.appendChild(intro);
  panel.appendChild(form);
  panel.appendChild(summary);
  section.appendChild(panel);

  return section;
}

function renderIntro(product) {
  const intro = document.createElement('div');
  intro.className = 'customization-intro';

  const icon = document.createElement('div');
  icon.className = 'magic-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.appendChild(renderIcon('sparkles'));

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Pedido personalizado';

  const title = document.createElement('h2');
  title.textContent = 'Dale forma a tu alfombra';

  const copy = document.createElement('p');
  copy.textContent =
    'Comparte tu idea, colores y medidas para preparar una propuesta visual hecha a mano.';

  intro.appendChild(icon);
  intro.appendChild(eyebrow);
  intro.appendChild(title);
  intro.appendChild(copy);

  if (product) {
    const base = document.createElement('span');
    base.className = 'customization-base';
    base.textContent = 'Base creativa: ' + product.name;
    intro.appendChild(base);
  }

  return intro;
}

function renderError(name) {
  const error = document.createElement('small');
  error.className = 'customization-error';
  error.dataset.errorFor = name;
  error.setAttribute('aria-live', 'polite');

  return error;
}

function renderSummary(draft) {
  const summary = document.createElement('aside');
  summary.className = 'customization-summary';
  summary.setAttribute('aria-label', 'Resumen de personalización');
  syncSummary(summary, draft);

  return summary;
}

function syncSummary(summary, draft) {
  summary.replaceChildren();

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Resumen';

  const title = document.createElement('h3');
  title.textContent = draft.description ? 'Idea en progreso' : 'Tu idea empieza aquí';

  const description = document.createElement('p');
  description.textContent = draft.description || 'Describe la alfombra que quieres crear.';

  const meta = document.createElement('dl');
  meta.className = 'customization-summary-list';
  appendSummaryItem(meta, 'Tamaño', draft.sizeLabel || 'A medida');
  appendSummaryItem(meta, 'Formato', getFormatLabel(draft.format));
  appendSummaryItem(meta, 'Referencia', draft.referenceUrl ? 'Incluida' : 'Opcional');

  const colors = document.createElement('div');
  colors.className = 'customization-summary-colors';
  (draft.preferredColors || []).forEach(function (color) {
    const swatch = document.createElement('span');
    swatch.style.setProperty('--swatch-color', color);
    swatch.setAttribute('aria-label', color);
    colors.appendChild(swatch);
  });

  summary.appendChild(eyebrow);
  summary.appendChild(title);
  summary.appendChild(description);
  summary.appendChild(meta);
  summary.appendChild(colors);
}

function appendSummaryItem(container, label, value) {
  const term = document.createElement('dt');
  term.textContent = label;

  const description = document.createElement('dd');
  description.textContent = value;

  container.appendChild(term);
  container.appendChild(description);
}

function getFormatLabel(format) {
  const option = customizationFormatOptions.find(function (item) {
    return item.value === format;
  });

  return option ? option.label : 'Libre';
}

function getSuccessMessage(result) {
  if (result.mode === 'api') {
    return result.customization.id
      ? 'Personalización enviada. ID: ' + result.customization.id + '. Pronto recibirás una propuesta.'
      : 'Personalización enviada. Revisaremos tu idea para preparar la propuesta.';
  }

  return 'Personalización preparada. El siguiente paso será confirmar el pedido.';
}

function redirectToSuccessPage(customization) {
  if (!customization || !customization.id) {
    return;
  }

  window.location.hash = '#/solicitud/' + encodeURIComponent(customization.id);
}

function showErrors(fields, form, errors = {}) {
  Object.keys(errors).forEach(function (name) {
    if (fields[name]) {
      fields[name].setError(errors[name]);
      return;
    }

    const error = form.querySelector('[data-error-for="' + name + '"]');
    if (error) {
      error.textContent = errors[name];
    }
  });
}

function clearErrors(fields, form) {
  Object.keys(fields).forEach(function (name) {
    fields[name].clearError();
  });

  form.querySelectorAll('[data-error-for]').forEach(function (error) {
    if (!fields[error.dataset.errorFor]) {
      error.textContent = '';
    }
  });
}

function clearFieldError(fields, form, name) {
  if (fields[name]) {
    fields[name].clearError();
    return;
  }

  const error = form.querySelector('[data-error-for="' + name + '"]');
  if (error) {
    error.textContent = '';
  }
}
