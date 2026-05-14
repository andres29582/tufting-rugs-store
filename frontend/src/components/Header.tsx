import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon/Icon';
import { IconButton } from '../shared/components/Button/Button';
import { useTranslation, type Language } from '../shared/i18n';

export type HeaderToolsControls = {
  closeMenu: () => void;
  openMenu: () => void;
};

type HeaderProps = {
  renderTools?: ((controls: HeaderToolsControls) => ReactNode) | undefined;
};

export function Header({ renderTools }: HeaderProps) {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuId = 'filter-menu';

  function openMenu() {
    setIsFilterOpen(true);
  }

  function closeMenu() {
    setIsFilterOpen(false);
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
    <header ref={headerRef} className={isFilterOpen ? 'site-header is-filter-open' : 'site-header'}>
      <div className="header-shell">
        <Brand />
        <MainNav />
        <div className="header-actions" aria-label={t('header.actions')}>
          <LanguageToggle />
          <IconButton
            icon="menu"
            className="menu-toggle"
            type="button"
            aria-label={t('header.openSearch')}
            aria-expanded={isFilterOpen}
            aria-controls={menuId}
            onClick={() => {
              setIsFilterOpen((current) => !current);
            }}
          />
          <IconButton icon="favorite" type="button" aria-label={t('header.favorites')} />
          <IconButton icon="shoppingBag" type="button" aria-label={t('header.bag')} />
          <Link className="order-link" to="/personalizar">
            {t('nav.order')}
          </Link>
        </div>
        <div id={menuId} className="filter-menu glass-panel" hidden={!isFilterOpen}>
          <div className="filter-menu-head">
            <span>{t('header.searchFilters')}</span>
            <IconButton
              icon="close"
              className="filter-menu-close"
              type="button"
              aria-label={t('header.closeSearch')}
              onClick={closeMenu}
            />
          </div>
          <div className="header-tools">{renderTools ? renderTools({ closeMenu, openMenu }) : null}</div>
        </div>
      </div>
    </header>
  );
}

function Brand() {
  const { t } = useTranslation();

  return (
    <Link className="brand" to="/" aria-label={t('brand.homeAria')}>
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

  function scrollToContact(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="main-nav" aria-label={t('nav.aria')}>
      <Link to="/">{t('nav.home')}</Link>
      <Link to="/catalogo">{t('nav.catalog')}</Link>
      <Link to="/personalizar">{t('nav.custom')}</Link>
      <Link to="/como-funciona">{t('nav.how')}</Link>
      <a href="#contacto" onClick={scrollToContact}>
        {t('nav.contact')}
      </a>
    </nav>
  );
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
