import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import { loginAdmin } from '../../features/admin/lib/adminAuth';
import { Button } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@rugs.local');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/productos');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo iniciar sesion.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell mainClassName="admin-main">
      <section className="admin-auth-section">
        <form className="admin-auth-card glass-panel" onSubmit={handleSubmit}>
          <p className="eyebrow">Admin</p>
          <h1>Entrar al panel</h1>
          <p>Accede para crear, editar, publicar o pausar alfombras del catalogo.</p>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <FormField
            label="Contrasena"
            name="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
          <p className="admin-status" aria-live="polite">
            {status}
          </p>
        </form>
      </section>
    </AppShell>
  );
}
