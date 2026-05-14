import { useTranslation } from '../shared/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contacto" className="site-footer">
      <div className="footer-grid">
        <div>
          <strong>Tuft Atelier</strong>
          <p>{t('footer.description')}</p>
        </div>
        <div>
          <span>{t('footer.serviceTitle')}</span>
          <p>{t('footer.serviceText')}</p>
        </div>
        <div>
          <span>{t('footer.paymentsTitle')}</span>
          <p>{t('footer.paymentsText')}</p>
        </div>
        <div>
          <span>{t('footer.qualityTitle')}</span>
          <p>{t('footer.qualityText')}</p>
        </div>
      </div>
    </footer>
  );
}
