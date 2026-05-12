import { renderAppShell } from '../../app/AppShell.js';
import { renderHeader } from '../../components/Header.js';
import { renderButtonLink } from '../../shared/components/Button/Button.js';

export function renderCustomizationSuccessPage({ params } = {}) {
  const requestId = params && params.id ? params.id : '';
  const section = document.createElement('section');
  section.className = 'page-section';

  const panel = document.createElement('div');
  panel.className = 'page-panel glass-panel';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Solicitud enviada';

  const title = document.createElement('h1');
  title.textContent = 'Tu idea ya está en camino';

  const copy = document.createElement('p');
  copy.textContent =
    'Revisaremos los detalles para preparar una propuesta visual y próximos pasos.';

  const code = document.createElement('strong');
  code.className = 'request-code';
  code.textContent = requestId ? 'Código: ' + requestId : 'Solicitud registrada';

  const actions = document.createElement('div');
  actions.className = 'page-actions';
  actions.appendChild(createLink('Volver al inicio', '#/', 'primary'));
  actions.appendChild(createLink('Ver catálogo', '#/catalogo', 'ghost'));

  panel.appendChild(eyebrow);
  panel.appendChild(title);
  panel.appendChild(copy);
  panel.appendChild(code);
  panel.appendChild(actions);
  section.appendChild(panel);

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
