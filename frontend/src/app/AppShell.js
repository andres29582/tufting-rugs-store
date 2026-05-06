import { renderFooter } from '../components/Footer.js';

export function renderAppShell(options = {}) {
  const fragment = document.createDocumentFragment();
  const main = document.createElement('main');
  const header = normalizeRenderedPart(options.header || null);
  const footer = normalizeRenderedPart(
    Object.prototype.hasOwnProperty.call(options, 'footer') ? options.footer : renderFooter()
  );

  if (options.mainClassName) {
    main.className = options.mainClassName;
  }

  appendChildren(main, options.children);

  appendRenderedPart(fragment, header);

  fragment.appendChild(main);
  appendRenderedPart(fragment, footer);

  return {
    element: fragment,
    main,
    destroy: composeCleanup(header && header.destroy, footer && footer.destroy)
  };
}

function normalizeRenderedPart(renderedPart) {
  if (!renderedPart) {
    return null;
  }

  if (renderedPart instanceof Node) {
    return {
      element: renderedPart
    };
  }

  return renderedPart;
}

function appendRenderedPart(container, renderedPart) {
  if (renderedPart && renderedPart.element instanceof Node) {
    container.appendChild(renderedPart.element);
  }
}

function appendChildren(container, children) {
  if (!children) {
    return;
  }

  if (children instanceof Node) {
    container.appendChild(children);
    return;
  }

  if (Array.isArray(children)) {
    children.forEach(function (child) {
      appendChildren(container, child);
    });
  }
}

function composeCleanup(...callbacks) {
  const cleanups = callbacks.filter(function (callback) {
    return typeof callback === 'function';
  });

  if (!cleanups.length) {
    return null;
  }

  return function cleanupAppShell() {
    cleanups.forEach(function (cleanup) {
      cleanup();
    });
  };
}
