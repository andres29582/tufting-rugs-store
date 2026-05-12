import { useParams } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import { ButtonLink } from '../../shared/components/Button/Button';

export function CustomizationSuccessPage() {
  const params = useParams<{ id: string }>();
  const requestId = params.id || '';

  return (
    <AppShell mainClassName="page-main">
      <section className="page-section">
        <div className="page-panel glass-panel">
          <p className="eyebrow">Solicitud enviada</p>
          <h1>Tu idea ya está en camino</h1>
          <p>Revisaremos los detalles para preparar una propuesta visual y próximos pasos.</p>
          <strong className="request-code">{requestId ? 'Código: ' + requestId : 'Solicitud registrada'}</strong>
          <div className="page-actions">
            <ButtonLink to="/" variant="primary">
              Volver al inicio
            </ButtonLink>
            <ButtonLink to="/catalogo" variant="ghost">
              Ver catálogo
            </ButtonLink>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
