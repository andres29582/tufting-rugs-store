import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { FeatureStrip } from '../../components/FeatureStrip';
import { HowItWorks } from '../../components/HowItWorks';
import { ProductFilters } from '../../features/products/components/ProductFilters/ProductFilters';
import { ProductSearch } from '../../features/products/components/ProductSearch/ProductSearch';
import { RugCatalog } from '../../features/products/components/RugCatalog/RugCatalog';
import {
  RugShowcaseCarousel,
  applyShowcaseTheme
} from '../../features/products/components/RugShowcase/RugShowcase';
import {
  loadProductCategories,
  loadProducts
} from '../../features/products/productsService';
import { localizeProduct } from '../../features/products/productLocalization';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';
import type { HeaderToolsControls } from '../../components/Header';
import { useTranslation, type Language } from '../../shared/i18n';

type HomePageProps = {
  scrollTo?: string;
};

type CatalogState = {
  query: string;
  category: string;
};

export function HomePage({ scrollTo }: HomePageProps) {
  const { language, t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [catalogState, setCatalogState] = useState<CatalogState>({
    query: '',
    category: 'Todas'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const showcaseProducts = useMemo(() => getShowcaseProducts(products), [products]);
  const filteredProducts = useFilteredProducts(products, catalogState, language);

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

        const firstShowcaseProduct = getShowcaseProducts(loadedProducts)[0];

        if (firstShowcaseProduct) {
          applyShowcaseTheme(firstShowcaseProduct);
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

  useEffect(() => {
    if (!scrollTo || isLoading) {
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [isLoading, scrollTo]);

  const renderHeaderTools = useCatalogHeaderTools({
    categories,
    catalogState,
    setCatalogState
  });

  if (isLoading) {
    return <AppLoadingState title={t('home.loading')} />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error, t)} onAction={loadPage} />;
  }

  return (
    <AppShell renderHeaderTools={renderHeaderTools}>
      <RugShowcaseCarousel rugs={showcaseProducts} />
      <FeatureStrip />
      <HowItWorks />
      <RugCatalog
        rugs={filteredProducts}
        query={catalogState.query}
        category={catalogState.category}
        showCustomizationCta={false}
      />
    </AppShell>
  );
}

export function useFilteredProducts(
  products: Product[],
  catalogState: CatalogState,
  language: Language = 'es'
): Product[] {
  return useMemo(() => {
    const normalizedQuery = catalogState.query.trim().toLowerCase();

    return products.filter((rug) => {
      const localizedRug = localizeProduct(rug, language);
      const matchesName =
        !normalizedQuery ||
        rug.name.toLowerCase().includes(normalizedQuery) ||
        localizedRug.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = catalogState.category === 'Todas' || rug.category === catalogState.category;

      return matchesName && matchesCategory;
    });
  }, [catalogState.category, catalogState.query, language, products]);
}

export function useCatalogHeaderTools({
  categories,
  catalogState,
  setCatalogState
}: {
  categories: string[];
  catalogState: CatalogState;
  setCatalogState: React.Dispatch<React.SetStateAction<CatalogState>>;
}): (controls: HeaderToolsControls) => ReactNode {
  return useCallback(
    ({ closeMenu }: HeaderToolsControls) => (
      <>
        <ProductSearch
          query={catalogState.query}
          onSearch={(query) => {
            setCatalogState((current) => ({
              ...current,
              query
            }));
          }}
          onSubmit={closeMenu}
        />
        <ProductFilters
          categories={categories}
          activeCategory={catalogState.category}
          onCategoryChange={(category) => {
            closeMenu();
            setCatalogState((current) => ({
              ...current,
              category
            }));
            document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </>
    ),
    [catalogState.category, catalogState.query, categories, setCatalogState]
  );
}

export function getCustomProduct(products: Product[]): Product | null {
  return (
    products.find((rug) => rug.category === 'Personalizadas') ||
    products.find((rug) => rug.customizable) ||
    null
  );
}

export function getShowcaseProducts(products: Product[]): Product[] {
  const featuredProducts = products.filter((rug) => rug.isFeatured);
  const featuredIds = new Set(featuredProducts.map((rug) => rug.id));
  const remainingProducts = products.filter((rug) => !featuredIds.has(rug.id));

  return [...featuredProducts, ...remainingProducts].slice(0, 6);
}
