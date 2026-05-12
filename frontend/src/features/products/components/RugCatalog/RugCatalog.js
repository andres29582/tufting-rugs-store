import { renderButtonLink } from '../../../../shared/components/Button/Button.js';
import { renderRugCard } from '../RugCard/RugCard.js';

export function renderRugCatalog(initialRugs) {
  const section = document.createElement('section');
  section.id = 'catalogo';
  section.className = 'catalog-section';

  const heading = document.createElement('div');
  heading.className = 'catalog-heading';

  const headingCopy = document.createElement('div');

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Catálogo destacado';

  const title = document.createElement('h2');
  title.textContent = 'Alfombras únicas, hechas para inspirar';

  const customLink = renderButtonLink({
    href: '#/personalizar',
    label: 'Quiero personalizar la mía',
    variant: 'ghost'
  });

  const summary = document.createElement('p');
  summary.className = 'result-summary';
  summary.setAttribute('aria-live', 'polite');

  const grid = document.createElement('div');
  grid.className = 'catalog-grid';

  headingCopy.appendChild(eyebrow);
  headingCopy.appendChild(title);
  heading.appendChild(headingCopy);
  heading.appendChild(customLink.element);
  section.appendChild(heading);
  section.appendChild(summary);
  section.appendChild(grid);

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
