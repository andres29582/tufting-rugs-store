import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { CustomizationForm } from '../../features/customizations/components/CustomizationForm/CustomizationForm';
import { loadProducts } from '../../features/products/productsService';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';
import { useTranslation } from '../../shared/i18n';
import { getCustomProduct } from '../HomePage/HomePage';

export function CustomizePage() {
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
  }, []);

  useEffect(() => loadPage(), [loadPage]);

  if (isLoading) {
    return <AppLoadingState title={t('customize.loading')} />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error, t)} onAction={loadPage} />;
  }

  return (
    <AppShell mainClassName="page-main">
      <CustomizationForm product={getCustomProduct(products)} />
    </AppShell>
  );
}
