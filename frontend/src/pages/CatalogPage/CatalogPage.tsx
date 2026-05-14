import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { RugCatalog } from '../../features/products/components/RugCatalog/RugCatalog';
import { loadProductCategories, loadProducts } from '../../features/products/productsService';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';
import { useTranslation } from '../../shared/i18n';
import { PageIntro } from '../shared/PageIntro';
import { useCatalogHeaderTools, useFilteredProducts } from '../HomePage/HomePage';

export function CatalogPage() {
  const { language, t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [catalogState, setCatalogState] = useState({
    query: '',
    category: 'Todas'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const filteredProducts = useFilteredProducts(products, catalogState, language);
  const renderHeaderTools = useCatalogHeaderTools({
    categories,
    catalogState,
    setCatalogState
  });

  const loadPage = useCallback(() => {
    let isCurrent = true;

    setIsLoading(true);
    setError(null);

    void Promise.all([loadProducts(), loadProductCategories()])
      .then(([loadedProducts, loadedCategories]) => {
        if (!isCurrent) {
          return;
        }

        setProducts(loadedProducts);
        setCategories(loadedCategories);
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
    <AppShell mainClassName="page-main" renderHeaderTools={renderHeaderTools}>
      <PageIntro
        eyebrow={t('catalog.eyebrow')}
        title={t('catalog.title')}
        copy={t('catalog.copy')}
      />
      <RugCatalog rugs={filteredProducts} query={catalogState.query} category={catalogState.category} />
    </AppShell>
  );
}
