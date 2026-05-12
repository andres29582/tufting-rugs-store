import { renderIcon } from '../Icon/Icon.js';

const variantAliases = {
  dark: 'secondary',
  light: 'primary'
};

export function renderButton(options = {}) {
  const button = document.createElement('button');
  const variant = getVariant(options.variant);

  button.className = getClassName('button', 'button-' + variant, options.className);
  button.type = options.type || 'button';
  button.disabled = Boolean(options.disabled);
  button.textContent = options.label || '';

  let destroy = noop;

  if (typeof options.onClick === 'function') {
    button.addEventListener('click', options.onClick);
    destroy = function destroyButton() {
      button.removeEventListener('click', options.onClick);
    };
  }

  return {
    element: button,
    setLabel: function (label) {
      button.textContent = label;
    },
    destroy
  };
}

export function renderButtonLink(options = {}) {
  const link = document.createElement('a');
  const variant = getVariant(options.variant);

  link.className = getClassName('button', 'button-' + variant, options.className);
  link.href = options.href || '#';
  link.textContent = options.label || '';

  setLinkAttributes(link, options);

  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }

  return {
    element: link,
    destroy: noop
  };
}

export function renderIconButton(options = {}) {
  const accessibleLabel = options.ariaLabel || options.label;

  if (!accessibleLabel) {
    throw new Error('renderIconButton requires an ariaLabel or accessible label.');
  }

  const button = document.createElement('button');
  button.className = getClassName('icon-button', options.className);
  button.type = options.type || 'button';
  button.disabled = Boolean(options.disabled);

  setAttributes(button, options.attributes);

  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.title) {
    button.title = options.title;
  }

  button.appendChild(renderIcon(options.icon, { className: options.iconClassName }));

  if (!options.ariaLabel) {
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = accessibleLabel;
    button.appendChild(label);
  }

  let destroy = noop;

  if (typeof options.onClick === 'function') {
    button.addEventListener('click', options.onClick);
    destroy = function destroyIconButton() {
      button.removeEventListener('click', options.onClick);
    };
  }

  return {
    element: button,
    destroy
  };
}

export function renderIconLink(options = {}) {
  const accessibleLabel = options.ariaLabel || options.label;

  if (!accessibleLabel) {
    throw new Error('renderIconLink requires an ariaLabel or accessible label.');
  }

  const link = document.createElement('a');
  link.className = getClassName('icon-button', options.className);
  link.href = options.href || '#';

  setLinkAttributes(link, options);

  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.title) {
    link.title = options.title;
  }

  link.appendChild(renderIcon(options.icon, { className: options.iconClassName }));

  if (!options.ariaLabel) {
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = accessibleLabel;
    link.appendChild(label);
  }

  return {
    element: link,
    destroy: noop
  };
}

function getVariant(variant) {
  const normalizedVariant = variantAliases[variant] || variant || 'primary';

  if (normalizedVariant === 'primary' || normalizedVariant === 'secondary' || normalizedVariant === 'ghost') {
    return normalizedVariant;
  }

  return 'primary';
}

function setAttributes(element, attributes = {}) {
  Object.keys(attributes).forEach(function (name) {
    const value = attributes[name];

    if (value === null || value === undefined) {
      element.removeAttribute(name);
      return;
    }

    element.setAttribute(name, String(value));
  });
}

function setLinkAttributes(link, options) {
  setAttributes(link, options.attributes);

  if (options.target) {
    link.target = options.target;
  }

  if (options.rel) {
    link.rel = options.rel;
  }
}

function getClassName(...classNames) {
  return classNames
    .filter(function (className) {
      return className;
    })
    .join(' ');
}

function noop() {}
