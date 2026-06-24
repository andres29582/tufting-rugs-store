import { useTranslation, type Translate } from '../../i18n';

type AppStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppLoadingState({ title, message }: AppStateProps) {
  const { t } = useTranslation();

  return (
    <section
      className="app-state app-state-loading"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="app-state-panel glass-panel">
        <span className="app-spinner" aria-hidden="true" />
        <h1>{title || t('state.loadingTitle')}</h1>
        <p>{message || t('state.loadingMessage')}</p>
      </div>
    </section>
  );
}

export function AppErrorState({ title, message, actionLabel, onAction }: AppStateProps) {
  const { t } = useTranslation();

  return (
    <section className="app-state app-state-error" role="alert">
      <div className="app-state-panel glass-panel">
        <h1>{title || t('state.errorTitle')}</h1>
        <p>{message || t('state.errorMessage')}</p>
        {onAction ? (
          <button className="button button-light" type="button" onClick={onAction}>
            {actionLabel || t('state.retry')}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function getFriendlyErrorMessage(error: unknown, t?: Translate): string {
  if (error instanceof TypeError) {
    return t
      ? t('state.serverConnectionError')
      : 'No se pudo conectar con el servidor. Revisa que la API este disponible e intentalo nuevamente.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return t ? t('state.errorMessage') : 'Revisa la conexion con el servidor e intentalo nuevamente.';
}
