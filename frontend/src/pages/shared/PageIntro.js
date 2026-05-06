import { renderButtonLink } from '../../shared/components/Button/Button.js';

export function renderPageIntro(options) {
  const section = document.createElement('section');
  section.className = 'page-section page-intro-section';

  const panel = document.createElement('div');
  panel.className = 'page-panel glass-panel';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = options.eyebrow;

  const title = document.createElement('h1');
  title.textContent = options.title;

  const copy = document.createElement('p');
  copy.textContent = options.copy;

  panel.appendChild(eyebrow);
  panel.appendChild(title);
  panel.appendChild(copy);

  if (Array.isArray(options.actions) && options.actions.length) {
    const actions = document.createElement('div');
    actions.className = 'page-actions';

    options.actions.forEach(function (action) {
      actions.appendChild(
        renderButtonLink({
          href: action.href,
          label: action.label,
          variant: action.variant || 'ghost',
          target: action.target,
          rel: action.rel,
          ariaLabel: action.ariaLabel
        }).element
      );
    });

    panel.appendChild(actions);
  }

  section.appendChild(panel);

  return section;
}
