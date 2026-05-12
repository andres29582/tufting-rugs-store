import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { ButtonLink } from '../../shared/components/Button/Button';
import { AppErrorState, AppLoadingState, getFriendlyErrorMessage } from '../../shared/components/AppState/AppState';
import { RugVisualMockup } from '../../features/products/components/RugVisualMockup/RugVisualMockup';
import { loadProductBySlug } from '../../features/products/productsService';
import { formatPrice } from '../../utils/money';

export function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const loadPage = useCallback(() => {
    let isCurrent = true;

    setIsLoading(true);
    setError(null);

    void loadProductBySlug(slug)
      .then((loadedProduct) => {
        if (!isCurrent) {
          return;
        }

        if (!loadedProduct) {
          throw new Error('No encontramos esa alfombra.');
        }

        setProduct(loadedProduct);
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
  }, [slug]);

  useEffect(() => loadPage(), [loadPage]);

  if (isLoading) {
    return <AppLoadingState title="Preparando detalle" />;
  }

  if (error || !product) {
    return <AppErrorState message={getFriendlyErrorMessage(error)} onAction={loadPage} />;
  }

  return (
    <AppShell mainClassName="page-main">
      <section className="page-section product-detail-section">
        <div className="product-detail-layout glass-panel">
          <div className="product-detail-media">
            <RugVisualMockup rug={product} />
          </div>
          <div className="product-detail-content">
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <strong className="product-detail-price">Desde {formatPrice(product.priceFrom)}</strong>
            <dl className="product-detail-meta">
              {product.material ? (
                <>
                  <dt>Material</dt>
                  <dd>{product.material}</dd>
                </>
              ) : null}
              {product.productionTime ? (
                <>
                  <dt>Produccion</dt>
                  <dd>{product.productionTime}</dd>
                </>
              ) : null}
            </dl>
            <ul className="product-detail-features">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="page-actions">
              <ButtonLink to="/personalizar" variant="primary">
                Personalizar similar
              </ButtonLink>
              <ButtonLink to="/catalogo" variant="ghost">
                Volver al catálogo
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
