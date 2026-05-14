import { useParams } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import { ButtonLink } from '../../shared/components/Button/Button';
import { useTranslation } from '../../shared/i18n';

export function CustomizationSuccessPage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const requestId = params.id || '';

  return (
    <AppShell mainClassName="page-main">
      <section className="page-section">
        <div className="page-panel glass-panel">
          <p className="eyebrow">{t('success.eyebrow')}</p>
          <h1>{t('success.title')}</h1>
          <p>{t('success.copy')}</p>
          <strong className="request-code">
            {requestId ? t('success.code', { id: requestId }) : t('success.registered')}
          </strong>
          <div className="page-actions">
            <ButtonLink to="/" variant="primary">
              {t('success.backHome')}
            </ButtonLink>
            <ButtonLink to="/catalogo" variant="ghost">
              {t('success.viewCatalog')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
