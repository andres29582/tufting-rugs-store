import { renderIconButton } from '../shared/components/Button/Button.js';
import { renderIcon } from '../shared/components/Icon/Icon.js';

export function renderHeader(options = {}) {
  const header = document.createElement('header');
  header.className = 'site-header';

  const shell = document.createElement('div');
  shell.className = 'header-shell';

  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.setAttribute('aria-label', 'Acciones rápidas');

  const menu = document.createElement('div');
  menu.id = 'filter-menu';
  menu.className = 'filter-menu glass-panel';
  menu.hidden = true;

  const menuToggle = renderIconButton({
    icon: 'menu',
    className: 'menu-toggle',
    ariaLabel: 'Abrir búsqueda y filtros',
    attributes: {
      'aria-expanded': 'false',
      'aria-controls': menu.id
    },
    onClick: handleMenuToggleClick
  });
  const favoritesButton = renderIconButton({
    icon: 'favorite',
    ariaLabel: 'Favoritos'
  });
  const bagButton = renderIconButton({
    icon: 'shoppingBag',
    ariaLabel: 'Bolsa de compra'
  });
  const menuClose = renderIconButton({
    icon: 'close',
    className: 'filter-menu-close',
    ariaLabel: 'Cerrar búsqueda y filtros',
    onClick: closeMenu
  });

  const orderLink = document.createElement('a');
  orderLink.className = 'order-link';
  orderLink.href = '#/personalizar';
  orderLink.textContent = 'Mi pedido';

  actions.appendChild(menuToggle.element);
  actions.appendChild(favoritesButton.element);
  actions.appendChild(bagButton.element);
  actions.appendChild(orderLink);

  const tools = renderFilterMenu(menu, menuClose.element);
  const renderTools = typeof options.renderTools === 'function' ? options.renderTools : null;

  if (renderTools) {
    appendHeaderTools(tools, renderTools({ closeMenu, openMenu }));
  }

  shell.appendChild(renderBrand());
  shell.appendChild(renderMainNav());
  shell.appendChild(actions);
  shell.appendChild(menu);
  header.appendChild(shell);

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleDocumentKeydown);

  function openMenu() {
    menu.hidden = false;
    header.classList.add('is-filter-open');
    menuToggle.element.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.hidden = true;
    header.classList.remove('is-filter-open');
    menuToggle.element.setAttribute('aria-expanded', 'false');
  }

  function handleMenuToggleClick() {
    if (header.classList.contains('is-filter-open')) {
      closeMenu();
      return;
    }

    openMenu();
  }

  function handleDocumentClick(event) {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  }

  function handleDocumentKeydown(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  return {
    element: header,
    openMenu,
    closeMenu,
    destroy: function () {
      menuToggle.destroy();
      favoritesButton.destroy();
      bagButton.destroy();
      menuClose.destroy();
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeydown);
    }
  };
}

function renderBrand() {
  const brand = document.createElement('a');
  brand.className = 'brand';
  brand.href = '#/';
  brand.setAttribute('aria-label', 'Ir al inicio');

  const mark = document.createElement('span');
  mark.className = 'brand-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.appendChild(renderIcon('tuftMark'));

  const copy = document.createElement('span');
  copy.className = 'brand-copy';

  const name = document.createElement('strong');
  name.textContent = 'Tuft Atelier';

  const detail = document.createElement('small');
  detail.textContent = 'Rugs made to order';

  copy.appendChild(name);
  copy.appendChild(detail);
  brand.appendChild(mark);
  brand.appendChild(copy);

  return brand;
}

function renderMainNav() {
  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  nav.setAttribute('aria-label', 'Navegación principal');

  [
    { href: '#/', label: 'Inicio' },
    { href: '#/catalogo', label: 'Catálogo' },
    { href: '#/personalizar', label: 'Personalizadas' },
    { href: '#/como-funciona', label: 'Cómo funciona' },
    { href: '#contacto', label: 'Contacto' }
  ].forEach(function (item) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    nav.appendChild(link);
  });

  return nav;
}

function renderFilterMenu(menu, closeButton) {
  const head = document.createElement('div');
  head.className = 'filter-menu-head';

  const title = document.createElement('span');
  title.textContent = 'Búsqueda y filtros';

  const tools = document.createElement('div');
  tools.className = 'header-tools';

  head.appendChild(title);
  head.appendChild(closeButton);
  menu.appendChild(head);
  menu.appendChild(tools);

  return tools;
}

function appendHeaderTools(container, renderedTools) {
  if (!renderedTools) {
    return;
  }

  if (renderedTools instanceof Node) {
    container.appendChild(renderedTools);
    return;
  }

  if (renderedTools.element instanceof Node) {
    container.appendChild(renderedTools.element);
    return;
  }

  if (Array.isArray(renderedTools)) {
    renderedTools.forEach(function (tool) {
      appendHeaderTools(container, tool);
    });
  }
}
