type AppStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppLoadingState({
  title = 'Preparando el catálogo',
  message = 'Estamos cargando las alfombras y opciones personalizadas.'
}: AppStateProps) {
  return (
    <section className="app-state app-state-loading" aria-busy="true" aria-live="polite" role="status">
      <div className="app-state-panel glass-panel">
        <span className="app-spinner" aria-hidden="true" />
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}

export function AppErrorState({
  title = 'No pudimos cargar la tienda',
  message = 'Revisa la conexión con el servidor e inténtalo nuevamente.',
  actionLabel = 'Reintentar',
  onAction
}: AppStateProps) {
  return (
    <section className="app-state app-state-error" role="alert">
      <div className="app-state-panel glass-panel">
        <h1>{title}</h1>
        <p>{message}</p>
        {onAction ? (
          <button className="button button-light" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Revisa que la API esté disponible e inténtalo nuevamente.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Revisa la conexión con el servidor e inténtalo nuevamente.';
}
