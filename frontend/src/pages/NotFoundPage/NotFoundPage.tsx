import { AppShell } from '../../app/AppShell';
import { PageIntro } from '../shared/PageIntro';

export function NotFoundPage() {
  return (
    <AppShell mainClassName="page-main">
      <PageIntro
        eyebrow="404"
        title="No encontramos esta página"
        copy="La ruta no existe o todavía no está disponible."
        actions={[
          {
            to: '/',
            label: 'Volver al inicio',
            variant: 'light'
          },
          {
            to: '/catalogo',
            label: 'Ver catálogo',
            variant: 'ghost'
          }
        ]}
      />
    </AppShell>
  );
}
