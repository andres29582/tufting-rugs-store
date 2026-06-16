import {
  buildGeneralContactMessage,
  buildWhatsappUrl,
  storeWhatsappDisplayNumber,
} from '../shared/config/contact';
import { useTranslation } from '../shared/i18n';

export function Footer() {
  const { language, t } = useTranslation();
  const whatsappContactUrl = buildWhatsappUrl(buildGeneralContactMessage(language));

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
        <div>
          <span>WhatsApp</span>
          <p>{storeWhatsappDisplayNumber}</p>
          <a
            className="footer-whatsapp-link"
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.whatsappAria')}
          >
            {t('footer.whatsappCta')}
          </a>
        </div>
      </div>
      <p className="footer-credit">
        Creado por{' '}
        <a
          href="https://andres-pignoloni-dev.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Andrés Eduardo Pignoloni Vasquez
        </a>
      </p>
    </footer>
  );
}
