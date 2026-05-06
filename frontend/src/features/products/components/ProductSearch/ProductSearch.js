import { renderIconButton } from '../../../../shared/components/Button/Button.js';

export function renderProductSearch(options) {
  const onSearch = options && options.onSearch ? options.onSearch : function () {};
  const form = document.createElement('form');
  form.className = 'search-bar';
  form.setAttribute('role', 'search');

  const label = document.createElement('label');
  label.className = 'sr-only';
  label.setAttribute('for', 'rug-search');
  label.textContent = 'Buscar alfombra por nombre';

  const input = document.createElement('input');
  input.id = 'rug-search';
  input.type = 'search';
  input.autocomplete = 'off';
  input.placeholder = 'Buscar por nombre...';

  const submit = renderIconButton({
    icon: 'search',
    type: 'submit',
    className: 'search-submit',
    ariaLabel: 'Buscar'
  });

  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(submit.element);

  input.addEventListener('input', function (event) {
    onSearch(event.target.value);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const catalog = document.getElementById('catalogo');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return form;
}
