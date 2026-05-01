import { renderRugCard } from '../RugCard/RugCard.js';

export function renderRugCatalog(initialRugs) {
  const section = document.createElement('section');
  section.id = 'catalogo';
  section.className = 'catalog-section';
  section.innerHTML = [
    '<div class="catalog-heading">',
    '  <div>',
    '    <p class="eyebrow">Catálogo destacado</p>',
    '    <h2>Alfombras únicas, hechas para inspirar</h2>',
    '  </div>',
    '  <a class="button button-ghost" href="#personalizadas">Quiero personalizar la mía</a>',
    '</div>',
    '<p class="result-summary" aria-live="polite"></p>',
    '<div class="catalog-grid"></div>'
  ].join('');

  const grid = section.querySelector('.catalog-grid');
  const summary = section.querySelector('.result-summary');

  function update(rugs, query, category) {
    grid.replaceChildren();

    if (!rugs.length) {
      grid.appendChild(renderEmptyState());
    } else {
      rugs.forEach(function (rug) {
        grid.appendChild(renderRugCard(rug));
      });
    }

    const categoryText = category && category !== 'Todas' ? ' en ' + category : '';
    const queryText = query ? ' para "' + query + '"' : '';
    summary.textContent = rugs.length + ' resultado' + (rugs.length === 1 ? '' : 's') + categoryText + queryText;
  }

  update(initialRugs, '', 'Todas');

  return {
    element: section,
    update
  };
}

function renderEmptyState() {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state glass-panel';

  const title = document.createElement('h3');
  title.textContent = 'No encontramos una alfombra con esos filtros';

  const description = document.createElement('p');
  description.textContent = 'Prueba con otra categoría o busca por un nombre más corto.';

  emptyState.appendChild(title);
  emptyState.appendChild(description);

  return emptyState;
}
