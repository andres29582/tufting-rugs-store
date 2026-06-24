import { AppShell } from '../../app/AppShell';
import { useTranslation } from '../../shared/i18n';
import { PageIntro } from '../shared/PageIntro';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <AppShell mainClassName="page-main">
      <PageIntro
        eyebrow="404"
        title={t('notFound.title')}
        copy={t('notFound.copy')}
        actions={[
          {
            to: '/',
            label: t('success.backHome'),
            variant: 'light',
          },
          {
            to: '/catalogo',
            label: t('success.viewCatalog'),
            variant: 'ghost',
          },
        ]}
      />
    </AppShell>
  );
}
