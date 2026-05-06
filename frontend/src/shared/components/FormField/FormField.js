let fieldId = 0;

export function renderFormField(options = {}) {
  const field = document.createElement('label');
  field.className = getClassName('form-field', options.className);

  const label = document.createElement('span');
  label.className = 'form-field-label';
  label.textContent = options.label || '';

  const control = document.createElement(options.as === 'textarea' ? 'textarea' : 'input');
  const controlId = options.id || 'form-field-' + String(++fieldId);
  control.id = controlId;
  control.className = 'form-field-control';
  control.name = options.name || '';
  control.value = options.value === null || options.value === undefined ? '' : String(options.value);

  if (control.tagName === 'INPUT') {
    control.type = options.type || 'text';
  }

  if (control.tagName === 'TEXTAREA') {
    control.rows = options.rows || 5;
  }

  if (options.placeholder) {
    control.placeholder = options.placeholder;
  }

  if (options.autocomplete) {
    control.setAttribute('autocomplete', options.autocomplete);
  }

  const error = document.createElement('small');
  error.id = controlId + '-error';
  error.className = 'form-field-error';
  error.dataset.errorFor = options.name || controlId;
  error.setAttribute('aria-live', 'polite');

  field.appendChild(label);
  field.appendChild(control);
  field.appendChild(error);

  return {
    element: field,
    control,
    input: control,
    error,
    setError: function (message) {
      if (!message) {
        clearError(control, error, field);
        return;
      }

      error.textContent = message;
      control.setAttribute('aria-invalid', 'true');
      control.setAttribute('aria-describedby', error.id);
      field.classList.add('has-error');
    },
    clearError: function () {
      clearError(control, error, field);
    },
    destroy: noop
  };
}

function clearError(control, error, field) {
  error.textContent = '';
  control.removeAttribute('aria-invalid');
  control.removeAttribute('aria-describedby');
  field.classList.remove('has-error');
}

function getClassName(...classNames) {
  return classNames
    .filter(function (className) {
      return className;
    })
    .join(' ');
}

function noop() {}
