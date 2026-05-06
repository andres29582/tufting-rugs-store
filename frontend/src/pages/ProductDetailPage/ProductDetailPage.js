import { renderAppShell } from '../../app/AppShell.js';
import { renderHeader } from '../../components/Header.js';
import { loadProductBySlug } from '../../features/products/productsService.js';
import { renderRugVisualMockup } from '../../features/products/components/RugVisualMockup/RugVisualMockup.js';
import { formatPrice } from '../../utils/money.js';
import { renderButtonLink } from '../../shared/components/Button/Button.js';

export async function renderProductDetailPage({ params } = {}) {
  const product = await loadProductBySlug(params && params.slug);

  if (!product) {
    throw new Error('No encontramos esa alfombra.');
  }

  const section = document.createElement('section');
  section.className = 'page-section product-detail-section';

  const layout = document.createElement('div');
  layout.className = 'product-detail-layout glass-panel';

  const media = document.createElement('div');
  media.className = 'product-detail-media';
  media.appendChild(renderRugVisualMockup(product));

  const content = document.createElement('div');
  content.className = 'product-detail-content';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = product.category;

  const title = document.createElement('h1');
  title.textContent = product.name;

  const description = document.createElement('p');
  description.textContent = product.description;

  const price = document.createElement('strong');
  price.className = 'product-detail-price';
  price.textContent = 'Desde ' + formatPrice(product.priceFrom);

  const features = document.createElement('ul');
  features.className = 'product-detail-features';
  product.features.forEach(function (feature) {
    const item = document.createElement('li');
    item.textContent = feature;
    features.appendChild(item);
  });

  const actions = document.createElement('div');
  actions.className = 'page-actions';
  actions.appendChild(createLink('Personalizar similar', '#/personalizar', 'primary'));
  actions.appendChild(createLink('Volver al catálogo', '#/catalogo', 'ghost'));

  content.appendChild(eyebrow);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(price);
  content.appendChild(features);
  content.appendChild(actions);

  layout.appendChild(media);
  layout.appendChild(content);
  section.appendChild(layout);

  return renderAppShell({
    header: renderHeader(),
    mainClassName: 'page-main',
    children: section
  });
}

function createLink(label, href, variant) {
  return renderButtonLink({
    href,
    label,
    variant
  }).element;
}
