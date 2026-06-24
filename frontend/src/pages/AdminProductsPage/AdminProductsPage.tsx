import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import { clearAdminToken, getAdminToken } from '../../features/admin/lib/adminAuth';
import {
  getAdminProducts,
  publishAdminProduct,
  unpublishAdminProduct,
} from '../../features/products/api/productsApi';
import type { Product } from '../../shared/types';
import { Button, ButtonLink } from '../../shared/components/Button/Button';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage,
} from '../../shared/components/AppState/AppState';
import { formatPrice } from '../../utils/money';

export function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [status, setStatus] = useState('');

  const loadProducts = useCallback(() => {
    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return undefined;
    }

    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    void getAdminProducts(token)
      .then((loadedProducts) => {
        if (isCurrent) {
          setProducts(loadedProducts);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [navigate]);

  useEffect(() => loadProducts(), [loadProducts]);

  async function togglePublication(product: Product) {
    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setStatus('');

    try {
      const updatedProduct = product.isActive
        ? await unpublishAdminProduct(product.id, token)
        : await publishAdminProduct(product.id, token);

      setProducts((current) =>
        current.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      );
      setStatus(updatedProduct.isActive ? 'Producto publicado.' : 'Producto despublicado.');
    } catch (toggleError) {
      setStatus(
        toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el producto.'
      );
    }
  }

  function handleLogout() {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }

  if (isLoading) {
    return <AppLoadingState title="Preparando productos" />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error)} onAction={loadProducts} />;
  }

  return (
    <AppShell mainClassName="admin-main">
      <section className="admin-section">
        <div className="admin-page-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Productos del catalogo</h1>
            <p>Gestiona las alfombras que se publican en el frontend.</p>
          </div>
          <div className="admin-page-actions">
            <ButtonLink to="/admin/pedidos" variant="secondary">
              Pedidos
            </ButtonLink>
            <ButtonLink to="/admin/productos/nuevo" variant="primary">
              Nuevo producto
            </ButtonLink>
            <Button type="button" variant="ghost" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
        <p className="admin-status" aria-live="polite">
          {status}
        </p>
        <div className="admin-table-wrap glass-panel">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Alfombra</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <span>
                      {product.category || 'Sin categoria'} / {product.size}
                    </span>
                  </td>
                  <td>{formatPrice(product.priceFrom)}</td>
                  <td>{product.type === 'FULL_CUSTOM' ? 'Personalizada' : 'Lista'}</td>
                  <td>
                    <span className={product.isActive ? 'admin-badge is-active' : 'admin-badge'}>
                      {product.isActive ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <ButtonLink
                        to={'/admin/productos/' + encodeURIComponent(product.id) + '/editar'}
                        variant="ghost"
                      >
                        Editar
                      </ButtonLink>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void togglePublication(product)}
                      >
                        {product.isActive ? 'Despublicar' : 'Publicar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td colSpan={5}>Todavia no hay productos cargados.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
