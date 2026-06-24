import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { FeatureStrip } from '../../components/FeatureStrip';
import { HowItWorks } from '../../components/HowItWorks';
import { RugCatalog } from '../../features/products/components/RugCatalog/RugCatalog';
import {
  RugShowcaseCarousel,
  applyShowcaseTheme,
} from '../../features/products/components/RugShowcase/RugShowcase';
import { loadProducts } from '../../features/products/services/productsService';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage,
} from '../../shared/components/AppState/AppState';
import { useTranslation } from '../../shared/i18n';

type HomePageProps = {
  scrollTo?: string;
};

export function HomePage({ scrollTo }: HomePageProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const showcaseProducts = useMemo(() => getShowcaseProducts(products), [products]);
  const catalogPreviewProducts = useMemo(() => products.slice(0, 3), [products]);

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

  if (isLoading) {
    return <AppLoadingState title={t('home.loading')} />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error, t)} onAction={loadPage} />;
  }

  return (
    <AppShell>
      <RugShowcaseCarousel rugs={showcaseProducts} />
      <FeatureStrip />
      <HowItWorks />
      <RugCatalog
        rugs={catalogPreviewProducts}
        ctaLabel={t('rugCatalog.viewAll')}
        ctaTo="/catalogo"
      />
    </AppShell>
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
