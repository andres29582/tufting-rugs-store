import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { ButtonLink } from '../../shared/components/Button/Button';
import { AppErrorState, AppLoadingState, getFriendlyErrorMessage } from '../../shared/components/AppState/AppState';
import { RugVisualMockup } from '../../features/products/components/RugVisualMockup/RugVisualMockup';
import { localizeProduct } from '../../features/products/model/productLocalization';
import { loadProductBySlug } from '../../features/products/services/productsService';
import { useTranslation } from '../../shared/i18n';
import { formatPrice } from '../../utils/money';

export function ProductDetailPage() {
  const { language, t } = useTranslation();
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
          throw new Error(t('productDetail.notFound'));
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
  }, [slug, t]);

  useEffect(() => loadPage(), [loadPage]);

  if (isLoading) {
    return <AppLoadingState title={t('productDetail.loading')} />;
  }

  if (error || !product) {
    return <AppErrorState message={getFriendlyErrorMessage(error, t)} onAction={loadPage} />;
  }

  const displayProduct = localizeProduct(product, language);

  return (
    <AppShell mainClassName="page-main">
      <section className="page-section product-detail-section">
        <div className="product-detail-layout glass-panel">
          <div className="product-detail-media">
            <RugVisualMockup rug={displayProduct} />
          </div>
          <div className="product-detail-content">
            <p className="eyebrow">{displayProduct.category}</p>
            <h1>{displayProduct.name}</h1>
            <p>{displayProduct.description}</p>
            <strong className="product-detail-price">
              {t('product.from')} {formatPrice(product.priceFrom)}
            </strong>
            <dl className="product-detail-meta">
              {displayProduct.material ? (
                <>
                  <dt>{t('productDetail.material')}</dt>
                  <dd>{displayProduct.material}</dd>
                </>
              ) : null}
              {displayProduct.productionTime ? (
                <>
                  <dt>{t('productDetail.production')}</dt>
                  <dd>{displayProduct.productionTime}</dd>
                </>
              ) : null}
            </dl>
            <ul className="product-detail-features">
              {displayProduct.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="page-actions">
              <ButtonLink to="/personalizar" variant="primary">
                {t('productDetail.customizeSimilar')}
              </ButtonLink>
              <ButtonLink to="/catalogo" variant="ghost">
                {t('productDetail.backCatalog')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
