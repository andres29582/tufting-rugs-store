export function renderHeader(options = {}) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = [
    '<div class="header-shell">',
    '  <a class="brand" href="#inicio" aria-label="Ir al inicio">',
    '    <span class="brand-mark" aria-hidden="true">',
    '      <svg viewBox="0 0 36 36">',
    '        <circle cx="18" cy="18" r="15"></circle>',
    '        <path d="M11 23.5c4.3-8.6 9.6-13 15.8-13.1M11.5 12.5c3 1.6 4.9 4 5.6 7.1m4.3-2.3c2.9 1.2 4.7 3.2 5.5 6"></path>',
    '      </svg>',
    '    </span>',
    '    <span class="brand-copy">',
    '      <strong>Tuft Atelier</strong>',
    '      <small>Rugs made to order</small>',
    '    </span>',
    '  </a>',
    '  <nav class="main-nav" aria-label="Navegación principal">',
    '    <a href="#inicio">Inicio</a>',
    '    <a href="#catalogo">Catálogo</a>',
    '    <a href="#personalizadas">Personalizadas</a>',
    '    <a href="#como-funciona">Cómo funciona</a>',
    '    <a href="#contacto">Contacto</a>',
    '  </nav>',
    '  <div class="header-actions" aria-label="Acciones rápidas">',
    '    <button class="icon-button menu-toggle" type="button" aria-expanded="false" aria-controls="filter-menu" aria-label="Abrir búsqueda y filtros">',
    '      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z"/></svg>',
    '    </button>',
    '    <button class="icon-button" type="button" aria-label="Favoritos">',
    '      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 10.7 19C5.6 14.4 2 11.1 2 7.1A5.1 5.1 0 0 1 7.2 2c2 0 3.7 1 4.8 2.5A5.8 5.8 0 0 1 16.8 2 5.1 5.1 0 0 1 22 7.1c0 4-3.6 7.3-8.7 11.9L12 20.5Zm0-3.1.2-.2c4.6-4.1 7.8-7 7.8-10.1A3.1 3.1 0 0 0 16.8 4c-1.7 0-3.3 1.1-3.9 2.7h-1.8A4.2 4.2 0 0 0 7.2 4 3.1 3.1 0 0 0 4 7.1c0 3.1 3.2 6 7.8 10.1l.2.2Z"/></svg>',
    '    </button>',
    '    <button class="icon-button" type="button" aria-label="Bolsa de compra">',
    '      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V7a5 5 0 0 1 10 0v1h3l1 13H3L4 8h3Zm2 0h6V7a3 3 0 0 0-6 0v1Zm-3.1 2-.7 9h13.6l-.7-9H17v3h-2v-3H9v3H7v-3H5.9Z"/></svg>',
    '    </button>',
    '    <a class="order-link" href="#personalizadas">Mi pedido</a>',
    '  </div>',
    '  <div class="filter-menu glass-panel" id="filter-menu" hidden>',
    '    <div class="filter-menu-head">',
    '      <span>Búsqueda y filtros</span>',
    '      <button class="icon-button filter-menu-close" type="button" aria-label="Cerrar búsqueda y filtros">',
    '        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4z"/><path d="M5 17.6 17.6 5l1.4 1.4L6.4 19z"/></svg>',
    '      </button>',
    '    </div>',
    '    <div class="header-tools"></div>',
    '  </div>',
    '</div>'
  ].join('');

  const tools = header.querySelector('.header-tools');
  const menu = header.querySelector('.filter-menu');
  const menuToggle = header.querySelector('.menu-toggle');
  const menuClose = header.querySelector('.filter-menu-close');
  const renderTools = typeof options.renderTools === 'function' ? options.renderTools : null;

  if (renderTools) {
    appendHeaderTools(tools, renderTools({ closeMenu, openMenu }));
  }

  function openMenu() {
    menu.hidden = false;
    header.classList.add('is-filter-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.hidden = true;
    header.classList.remove('is-filter-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', function () {
    if (header.classList.contains('is-filter-open')) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menuClose.addEventListener('click', closeMenu);

  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  return {
    element: header,
    openMenu,
    closeMenu
  };
}

function appendHeaderTools(container, renderedTools) {
  if (!renderedTools) {
    return;
  }

  if (renderedTools instanceof Node) {
    container.appendChild(renderedTools);
    return;
  }

  if (Array.isArray(renderedTools)) {
    renderedTools.forEach(function (tool) {
      appendHeaderTools(container, tool);
    });
  }
}
