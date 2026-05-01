export function renderProductSearch(options) {
  const onSearch = options && options.onSearch ? options.onSearch : function () {};
  const form = document.createElement('form');
  form.className = 'search-bar';
  form.setAttribute('role', 'search');
  form.innerHTML = [
    '<label class="sr-only" for="rug-search">Buscar alfombra por nombre</label>',
    '<input id="rug-search" type="search" autocomplete="off" placeholder="Buscar por nombre...">',
    '<button class="icon-button search-submit" type="submit" aria-label="Buscar">',
    '  <svg viewBox="0 0 24 24" aria-hidden="true">',
    '    <path d="M10.7 18.4a7.7 7.7 0 1 1 0-15.4 7.7 7.7 0 0 1 0 15.4Zm0-2a5.7 5.7 0 1 0 0-11.4 5.7 5.7 0 0 0 0 11.4Z"/>',
    '    <path d="m16.4 16.1 4.2 4.2-1.5 1.4-4.2-4.2z"/>',
    '  </svg>',
    '</button>'
  ].join('');

  const input = form.querySelector('input');
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
