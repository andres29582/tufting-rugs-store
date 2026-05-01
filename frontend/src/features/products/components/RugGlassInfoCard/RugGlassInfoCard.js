import { formatPrice } from '../../../../utils/money.js';

export function renderRugGlassInfoCard(rug, options) {
  const headingTag = options && options.hero ? 'h1' : 'h2';
  const card = document.createElement('article');
  card.className = 'rug-info-card glass-panel';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = rug.category + ' · Tufting hecho a mano';

  const heading = document.createElement(headingTag);
  heading.textContent = rug.name;

  const description = document.createElement('p');
  description.className = 'rug-description';
  description.textContent = rug.description;

  const features = document.createElement('ul');
  features.className = 'feature-list';
  rug.features.forEach(function (feature) {
    const item = document.createElement('li');
    const marker = document.createElement('span');
    marker.setAttribute('aria-hidden', 'true');
    item.appendChild(marker);
    item.append(document.createTextNode(feature));
    features.appendChild(item);
  });

  const pricePanel = document.createElement('div');
  pricePanel.className = 'price-panel';

  const priceLabel = document.createElement('span');
  priceLabel.textContent = 'Desde';

  const price = document.createElement('strong');
  price.textContent = formatPrice(rug.priceFrom);

  const size = document.createElement('small');
  size.textContent = rug.size;

  pricePanel.appendChild(priceLabel);
  pricePanel.appendChild(price);
  pricePanel.appendChild(size);

  const colorRow = document.createElement('div');
  colorRow.className = 'color-row';
  colorRow.setAttribute('aria-label', 'Colores principales');
  rug.colors.forEach(function (color) {
    colorRow.appendChild(renderColorSwatch(color));
  });

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  buttonRow.appendChild(renderActionButton('Ver detalles', 'details', rug.slug, 'button button-dark'));
  buttonRow.appendChild(renderActionButton('Personalizar', 'customize', rug.slug, 'button button-light'));
  buttonRow.appendChild(renderActionButton('Quiero una parecida', 'similar', rug.slug, 'button button-ghost'));

  card.appendChild(eyebrow);
  card.appendChild(heading);
  card.appendChild(description);
  card.appendChild(features);
  card.appendChild(pricePanel);
  card.appendChild(colorRow);
  card.appendChild(buttonRow);

  return card;
}

function renderColorSwatch(color) {
  const swatch = document.createElement('span');
  swatch.className = 'color-swatch';
  swatch.style.setProperty('--swatch-color', color);
  swatch.setAttribute('aria-label', color);

  return swatch;
}

function renderActionButton(label, action, slug, className) {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.rugSlug = slug;
  button.textContent = label;

  return button;
}
