import { renderAppShell } from '../../app/AppShell.js';
import { renderHeader } from '../../components/Header.js';
import { renderPageIntro } from '../shared/PageIntro.js';

export function renderNotFoundPage() {
  return renderAppShell({
    header: renderHeader(),
    mainClassName: 'page-main',
    children: renderPageIntro({
      eyebrow: '404',
      title: 'No encontramos esta página',
      copy: 'La ruta no existe o todavía no está disponible.',
      actions: [
        {
          href: '#/',
          label: 'Volver al inicio',
          variant: 'light'
        },
        {
          href: '#/catalogo',
          label: 'Ver catálogo',
          variant: 'ghost'
        }
      ]
    })
  });
}
