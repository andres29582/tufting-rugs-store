import { renderFormField } from '../../../../shared/components/FormField/FormField.js';

export function renderReferenceUploader(options = {}) {
  const onChange = typeof options.onChange === 'function' ? options.onChange : function () {};
  const field = renderFormField({
    label: 'Referencia visual',
    name: 'referenceUrl',
    type: 'url',
    placeholder: 'https://...',
    autocomplete: 'url',
    value: options.value || '',
    className: 'customization-field customization-reference'
  });

  const hint = document.createElement('small');
  hint.textContent = 'Link opcional a una imagen, moodboard o inspiración.';

  function handleInput(event) {
    onChange(event.target.value);
  }

  field.control.addEventListener('input', handleInput);
  field.element.appendChild(hint);

  return {
    element: field.element,
    getValue: function () {
      return field.control.value.trim();
    },
    setError: field.setError,
    clearError: field.clearError,
    destroy: function () {
      field.control.removeEventListener('input', handleInput);
    }
  };
}
