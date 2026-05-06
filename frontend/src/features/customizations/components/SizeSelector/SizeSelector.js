import {
  customizationFormatOptions,
  customizationSizeOptions
} from '../../customizationDraft.js';

export function renderSizeSelector(options = {}) {
  const onChange = typeof options.onChange === 'function' ? options.onChange : function () {};
  const state = {
    sizeCategory: options.sizeCategory || 'MEDIUM',
    sizeLabel: options.sizeLabel || '100 x 80 cm',
    format: options.format || 'ORGANIC'
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'customization-size-format';
  wrapper.appendChild(renderSizeFieldset(state, onChange));
  wrapper.appendChild(renderFormatFieldset(state, onChange));

  return {
    element: wrapper,
    getValue: function () {
      return { ...state };
    }
  };
}

function renderSizeFieldset(state, onChange) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'customization-field';

  const legend = document.createElement('legend');
  legend.textContent = 'Tamaño';
  fieldset.appendChild(legend);

  const grid = document.createElement('div');
  grid.className = 'customization-option-grid';

  customizationSizeOptions.forEach(function (option) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'customization-choice';
    button.dataset.sizeCategory = option.sizeCategory;
    button.setAttribute('aria-pressed', String(option.sizeCategory === state.sizeCategory));

    const label = document.createElement('strong');
    label.textContent = option.label;

    const detail = document.createElement('span');
    detail.textContent = option.detail;

    button.appendChild(label);
    button.appendChild(detail);
    button.addEventListener('click', function () {
      state.sizeCategory = option.sizeCategory;
      state.sizeLabel = option.sizeLabel;
      syncPressedState(grid, 'sizeCategory', state.sizeCategory);
      onChange({ ...state });
    });

    grid.appendChild(button);
  });

  fieldset.appendChild(grid);
  return fieldset;
}

function renderFormatFieldset(state, onChange) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'customization-field';

  const legend = document.createElement('legend');
  legend.textContent = 'Formato';
  fieldset.appendChild(legend);

  const grid = document.createElement('div');
  grid.className = 'customization-format-grid';

  customizationFormatOptions.forEach(function (option) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'customization-format';
    button.dataset.format = option.value;
    button.textContent = option.label;
    button.setAttribute('aria-pressed', String(option.value === state.format));
    button.addEventListener('click', function () {
      state.format = option.value;
      syncPressedState(grid, 'format', state.format);
      onChange({ ...state });
    });

    grid.appendChild(button);
  });

  fieldset.appendChild(grid);
  return fieldset;
}

function syncPressedState(container, dataKey, activeValue) {
  container.querySelectorAll('button').forEach(function (button) {
    button.setAttribute('aria-pressed', String(button.dataset[dataKey] === activeValue));
  });
}
