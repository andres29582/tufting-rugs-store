import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon/Icon';
import { IconButton } from '../shared/components/Button/Button';
import { useTranslation, type Language } from '../shared/i18n';

const customizationRestartEvent = 'tuft:restart-customization';

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuId = 'mobile-navigation-menu';

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleDocumentKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeydown);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeydown);
    };
  }, []);

  return (
    <header ref={headerRef} className={isMenuOpen ? 'site-header is-menu-open' : 'site-header'}>
      <div className="header-shell">
        <Brand />
        <MainNav />
        <div className="header-actions" aria-label={t('header.actions')}>
          <LanguageToggle />
          <IconButton
            icon="menu"
            className="menu-toggle"
            type="button"
            aria-label={t('header.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => {
              setIsMenuOpen((current) => !current);
            }}
          />
          <Link className="order-link" to="/personalizar" onClick={restartCustomizationFlow}>
            {t('nav.order')}
          </Link>
        </div>
        <div id={menuId} className="mobile-nav-menu glass-panel" hidden={!isMenuOpen}>
          <div className="mobile-nav-menu-head">
            <span>{t('header.mobileMenu')}</span>
            <IconButton
              icon="close"
              className="mobile-nav-menu-close"
              type="button"
              aria-label={t('header.closeMenu')}
              onClick={closeMenu}
            />
          </div>
          <MobileNav onNavigate={closeMenu} />
        </div>
      </div>
    </header>
  );
}

function Brand() {
  const { t } = useTranslation();

  return (
    <Link className="brand" to="/" aria-label={t('brand.homeAria')} onClick={scrollToPageTop}>
      <span className="brand-mark" aria-hidden="true">
        <Icon name="tuftMark" />
      </span>
      <span className="brand-copy">
        <strong>Tuft Atelier</strong>
        <small>{t('brand.tagline')}</small>
      </span>
    </Link>
  );
}

function MainNav() {
  const { t } = useTranslation();

  return (
    <nav className="main-nav" aria-label={t('nav.aria')}>
      <Link to="/" onClick={scrollToPageTop}>{t('nav.home')}</Link>
      <Link to="/catalogo">{t('nav.catalog')}</Link>
      <Link to="/personalizar" onClick={restartCustomizationFlow}>{t('nav.custom')}</Link>
      <Link to="/como-funciona">{t('nav.how')}</Link>
    </nav>
  );
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useTranslation();

  return (
    <nav className="mobile-nav-links" aria-label={t('nav.aria')}>
      <Link
        to="/"
        onClick={() => {
          scrollToPageTop();
          onNavigate();
        }}
      >
        {t('nav.home')}
      </Link>
      <Link to="/catalogo" onClick={onNavigate}>{t('nav.catalog')}</Link>
      <Link
        to="/personalizar"
        onClick={() => {
          restartCustomizationFlow();
          onNavigate();
        }}
      >
        {t('nav.custom')}
      </Link>
      <Link to="/como-funciona" onClick={onNavigate}>{t('nav.how')}</Link>
    </nav>
  );
}

function restartCustomizationFlow() {
  window.dispatchEvent(new Event(customizationRestartEvent));
}

function scrollToPageTop() {
  window.setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
}

function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation();

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
  }

  return (
    <div className="language-toggle" role="group" aria-label={t('language.label')}>
      <button
        type="button"
        aria-label={t('language.setSpanish')}
        aria-pressed={language === 'es'}
        onClick={() => selectLanguage('es')}
      >
        {t('language.spanish')}
      </button>
      <button
        type="button"
        aria-label={t('language.setPortuguese')}
        aria-pressed={language === 'pt'}
        onClick={() => selectLanguage('pt')}
      >
        {t('language.portuguese')}
      </button>
    </div>
  );
}
