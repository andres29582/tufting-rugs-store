import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon/Icon';
import { IconButton } from '../shared/components/Button/Button';

export type HeaderToolsControls = {
  closeMenu: () => void;
  openMenu: () => void;
};

type HeaderProps = {
  renderTools?: ((controls: HeaderToolsControls) => ReactNode) | undefined;
};

export function Header({ renderTools }: HeaderProps) {
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
        <div className="header-actions" aria-label="Acciones rápidas">
          <IconButton
            icon="menu"
            className="menu-toggle"
            type="button"
            aria-label="Abrir búsqueda y filtros"
            aria-expanded={isFilterOpen}
            aria-controls={menuId}
            onClick={() => {
              setIsFilterOpen((current) => !current);
            }}
          />
          <IconButton icon="favorite" type="button" aria-label="Favoritos" />
          <IconButton icon="shoppingBag" type="button" aria-label="Bolsa de compra" />
          <Link className="order-link" to="/personalizar">
            Mi pedido
          </Link>
        </div>
        <div id={menuId} className="filter-menu glass-panel" hidden={!isFilterOpen}>
          <div className="filter-menu-head">
            <span>Búsqueda y filtros</span>
            <IconButton
              icon="close"
              className="filter-menu-close"
              type="button"
              aria-label="Cerrar búsqueda y filtros"
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
  return (
    <Link className="brand" to="/" aria-label="Ir al inicio">
      <span className="brand-mark" aria-hidden="true">
        <Icon name="tuftMark" />
      </span>
      <span className="brand-copy">
        <strong>Tuft Atelier</strong>
        <small>Rugs made to order</small>
      </span>
    </Link>
  );
}

function MainNav() {
  function scrollToContact(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="main-nav" aria-label="Navegación principal">
      <Link to="/">Inicio</Link>
      <Link to="/catalogo">Catálogo</Link>
      <Link to="/personalizar">Personalizadas</Link>
      <Link to="/como-funciona">Cómo funciona</Link>
      <a href="#contacto" onClick={scrollToContact}>
        Contacto
      </a>
    </nav>
  );
}
