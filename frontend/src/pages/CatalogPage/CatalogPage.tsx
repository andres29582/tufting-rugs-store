import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { RugCatalog } from '../../features/products/components/RugCatalog/RugCatalog';
import { loadProducts } from '../../features/products/services/productsService';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage,
} from '../../shared/components/AppState/AppState';
import { useTranslation } from '../../shared/i18n';

export function CatalogPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const loadPage = useCallback(() => {
    let isCurrent = true;

    setIsLoading(true);
    setError(null);

    void loadProducts()
      .then((loadedProducts) => {
        if (!isCurrent) {
          return;
        }

        setProducts(loadedProducts);
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
  }, []);

  useEffect(() => loadPage(), [loadPage]);

  if (isLoading) {
    return <AppLoadingState title={t('catalog.loading')} />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error, t)} onAction={loadPage} />;
  }

  return (
    <AppShell mainClassName="page-main">
      <RugCatalog
        rugs={products}
        ctaLabel={t('catalog.customizeCta')}
        headingTitle={t('catalog.eyebrow')}
        showEyebrow={false}
      />
    </AppShell>
  );
}
