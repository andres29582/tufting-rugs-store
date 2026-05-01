import { renderRugGlassInfoCard } from '../RugGlassInfoCard/RugGlassInfoCard.js';
import { renderRugVisualMockup } from '../RugVisualMockup/RugVisualMockup.js';

export function applyRugVars(element, rug) {
  element.style.setProperty('--rug-a', rug.colors[0]);
  element.style.setProperty('--rug-b', rug.colors[1]);
  element.style.setProperty('--rug-c', rug.colors[2]);
  element.style.setProperty('--rug-deep', rug.colors[0]);
}

export function renderRugShowcase(rug, options) {
  const isHero = options && options.hero;
  const index = options && typeof options.index === 'number' ? options.index : 0;
  const section = document.createElement('section');
  section.className = 'showcase-section snap-section';
  section.id = isHero ? 'inicio' : rug.slug;
  section.dataset.rugSlug = rug.slug;
  section.dataset.rugColors = rug.colors.join(',');
  section.setAttribute('aria-labelledby', 'showcase-title-' + rug.slug);
  applyRugVars(section, rug);

  const inner = document.createElement('div');
  inner.className = 'showcase-inner';
  if (index % 2 === 1 && !isHero) {
    inner.classList.add('showcase-inner-reverse');
  }

  const infoCard = renderRugGlassInfoCard(rug, { hero: isHero });
  const title = infoCard.querySelector('h1, h2');
  if (title) {
    title.id = 'showcase-title-' + rug.slug;
  }

  const visualWrap = document.createElement('div');
  visualWrap.className = 'showcase-visual';
  visualWrap.appendChild(renderRugVisualMockup(rug));
  visualWrap.appendChild(renderFloatingSpec(rug));

  inner.appendChild(infoCard);
  inner.appendChild(visualWrap);
  section.appendChild(inner);

  if (isHero) {
    section.appendChild(renderScrollHint());
  }

  return section;
}

function renderFloatingSpec(rug) {
  const spec = document.createElement('aside');
  spec.className = 'floating-spec glass-panel';
  spec.setAttribute('aria-label', 'Ficha rápida de ' + rug.name);

  appendSpecItem(spec, 'Diseño', rug.name);
  appendSpecItem(spec, 'Tamaño', rug.size);
  appendSpecItem(spec, 'Categoría', rug.category);

  return spec;
}

function appendSpecItem(container, label, value) {
  const labelElement = document.createElement('span');
  labelElement.textContent = label;

  const valueElement = document.createElement('strong');
  valueElement.textContent = value;

  container.appendChild(labelElement);
  container.appendChild(valueElement);
}

function renderScrollHint() {
  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.setAttribute('aria-hidden', 'true');

  for (let index = 0; index < 3; index += 1) {
    hint.appendChild(document.createElement('span'));
  }

  return hint;
}
