import { formatPrice } from '../../../../utils/money.js';
import { renderIconLink } from '../../../../shared/components/Button/Button.js';
import { renderRugVisualMockup } from '../RugVisualMockup/RugVisualMockup.js';

export function renderRugCard(rug) {
  const card = document.createElement('article');
  card.className = 'rug-card glass-panel';
  card.dataset.category = rug.category;

  const media = document.createElement('div');
  media.className = 'rug-card-media';
  media.appendChild(renderRugVisualMockup(rug));

  const body = document.createElement('div');
  body.className = 'rug-card-body';

  const content = document.createElement('div');
  const category = document.createElement('p');
  category.className = 'card-category';
  category.textContent = rug.category;

  const title = document.createElement('h3');
  title.textContent = rug.name;

  const size = document.createElement('p');
  size.textContent = rug.size;

  content.appendChild(category);
  content.appendChild(title);
  content.appendChild(size);

  const bottom = document.createElement('div');
  bottom.className = 'card-bottom';

  const price = document.createElement('strong');
  price.textContent = formatPrice(rug.priceFrom);

  const actions = document.createElement('div');
  actions.className = 'mini-actions';
  actions.appendChild(createFavoriteButton(rug));
  actions.appendChild(createDetailsButton(rug));

  bottom.appendChild(price);
  bottom.appendChild(actions);

  body.appendChild(content);
  body.appendChild(bottom);
  card.appendChild(media);
  card.appendChild(body);

  return card;
}

function createFavoriteButton(rug) {
  const button = document.createElement('button');
  button.className = 'icon-button';
  button.type = 'button';
  button.setAttribute('aria-label', 'Agregar ' + rug.name + ' a favoritos');
  button.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 10.7 19C5.6 14.4 2 11.1 2 7.1A5.1 5.1 0 0 1 7.2 2c2 0 3.7 1 4.8 2.5A5.8 5.8 0 0 1 16.8 2 5.1 5.1 0 0 1 22 7.1c0 4-3.6 7.3-8.7 11.9L12 20.5Z"/></svg>';

  return button;
}

function createDetailsButton(rug) {
  return renderIconLink({
    href: '#/producto/' + encodeURIComponent(rug.slug),
    icon: 'shoppingCart',
    ariaLabel: 'Ver detalles de ' + rug.name
  }).element;
}
