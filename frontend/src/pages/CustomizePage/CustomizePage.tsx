import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../../shared/types';
import { AppShell } from '../../app/AppShell';
import { AiPersonalizationGate } from '../../features/aiDesign/components/AiPersonalizationGate';
import { CustomizationForm } from '../../features/customizations/components/CustomizationForm/CustomizationForm';
import { loadProducts } from '../../features/products/services/productsService';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage,
} from '../../shared/components/AppState/AppState';
import { useTranslation } from '../../shared/i18n';
import { getCustomProduct } from '../HomePage/HomePage';

const customizationRestartEvent = 'tuft:restart-customization';

export function CustomizePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [showCustomizationForm, setShowCustomizationForm] = useState(false);
  const [customizationResetKey, setCustomizationResetKey] = useState(0);

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

  useEffect(() => {
    function handleCustomizationRestart() {
      setShowCustomizationForm(false);
      setCustomizationResetKey((currentKey) => currentKey + 1);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    window.addEventListener(customizationRestartEvent, handleCustomizationRestart);

    return () => {
      window.removeEventListener(customizationRestartEvent, handleCustomizationRestart);
    };
  }, []);

  if (isLoading) {
    return <AppLoadingState title={t('customize.loading')} />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error, t)} onAction={loadPage} />;
  }

  return (
    <AppShell mainClassName="page-main">
      {showCustomizationForm ? (
        <CustomizationForm product={getCustomProduct(products)} />
      ) : (
        <AiPersonalizationGate
          key={customizationResetKey}
          onContinueToForm={() => setShowCustomizationForm(true)}
        />
      )}
    </AppShell>
  );
}
