export function renderAppLoadingState(options = {}) {
  return renderAppState({
    kind: 'loading',
    title: options.title || 'Preparando el catálogo',
    message: options.message || 'Estamos cargando las alfombras y opciones personalizadas.'
  });
}

export function renderAppErrorState(options = {}) {
  return renderAppState({
    kind: 'error',
    title: options.title || 'No pudimos cargar la tienda',
    message: options.message || 'Revisa la conexión con el servidor e inténtalo nuevamente.',
    actionLabel: options.actionLabel || 'Reintentar',
    onAction: options.onRetry || options.onAction
  });
}

export function getFriendlyErrorMessage(error) {
  if (error && error.name === 'TypeError') {
    return 'No se pudo conectar con el servidor. Revisa que la API esté disponible e inténtalo nuevamente.';
  }

  if (error && error.message) {
    return error.message;
  }

  return 'Revisa la conexión con el servidor e inténtalo nuevamente.';
}

function renderAppState(options) {
  const section = document.createElement('section');
  section.className = 'app-state app-state-' + options.kind;

  if (options.kind === 'loading') {
    section.setAttribute('aria-busy', 'true');
    section.setAttribute('aria-live', 'polite');
    section.setAttribute('role', 'status');
  }

  if (options.kind === 'error') {
    section.setAttribute('role', 'alert');
  }

  const panel = document.createElement('div');
  panel.className = 'app-state-panel glass-panel';

  if (options.kind === 'loading') {
    const spinner = document.createElement('span');
    spinner.className = 'app-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    panel.appendChild(spinner);
  }

  const title = document.createElement('h1');
  title.textContent = options.title;

  const copy = document.createElement('p');
  copy.textContent = options.message;

  panel.appendChild(title);
  panel.appendChild(copy);

  if (options.actionLabel && typeof options.onAction === 'function') {
    const action = document.createElement('button');
    action.className = 'button button-light';
    action.type = 'button';
    action.textContent = options.actionLabel;
    action.addEventListener('click', options.onAction);
    panel.appendChild(action);
  }

  section.appendChild(panel);

  return section;
}
