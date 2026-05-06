import { customizationColorOptions } from '../../customizationDraft.js';

export function renderColorSelector(options = {}) {
  const selectedColors = new Set(options.selectedColors || []);
  const onChange = typeof options.onChange === 'function' ? options.onChange : function () {};

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'customization-field customization-colors';

  const legend = document.createElement('legend');
  legend.textContent = 'Colores principales';
  fieldset.appendChild(legend);

  const grid = document.createElement('div');
  grid.className = 'customization-color-grid';

  customizationColorOptions.forEach(function (color) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'customization-color-option';
    button.dataset.color = color.value;
    button.style.setProperty('--swatch-color', color.value);
    button.setAttribute('aria-label', color.name);
    button.setAttribute('aria-pressed', String(selectedColors.has(color.value)));

    const swatch = document.createElement('span');
    swatch.setAttribute('aria-hidden', 'true');

    const label = document.createElement('strong');
    label.textContent = color.name;

    button.appendChild(swatch);
    button.appendChild(label);
    button.addEventListener('click', function () {
      if (selectedColors.has(color.value)) {
        selectedColors.delete(color.value);
      } else {
        selectedColors.add(color.value);
      }

      syncPressedState(grid, selectedColors);
      onChange(Array.from(selectedColors));
    });

    grid.appendChild(button);
  });

  fieldset.appendChild(grid);

  return {
    element: fieldset,
    getValue: function () {
      return Array.from(selectedColors);
    }
  };
}

function syncPressedState(container, selectedColors) {
  container.querySelectorAll('[data-color]').forEach(function (button) {
    button.setAttribute('aria-pressed', String(selectedColors.has(button.dataset.color)));
  });
}
