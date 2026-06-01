import type { Product } from '../../../../shared/types';
import { ButtonLink } from '../../../../shared/components/Button/Button';
import { useTranslation } from '../../../../shared/i18n';
import { localizeCategory } from '../../productLocalization';
import { RugCard } from '../RugCard/RugCard';

type RugCatalogProps = {
  rugs: Product[];
  query?: string;
  category?: string;
  ctaLabel?: string;
  ctaTo?: string;
  headingTitle?: string;
  showEyebrow?: boolean;
  showCustomizationCta?: boolean;
};

export function RugCatalog({
  rugs,
  query = '',
  category = 'Todas',
  ctaLabel,
  ctaTo = '/personalizar',
  headingTitle,
  showEyebrow = true,
  showCustomizationCta = true
}: RugCatalogProps) {
  const { language, t } = useTranslation();
  const actionLabel = ctaLabel || t('rugCatalog.cta');
  const title = headingTitle || t('rugCatalog.title');
  const categoryText =
    category && category !== 'Todas'
      ? t('rugCatalog.categorySuffix', { category: localizeCategory(category, language) })
      : '';
  const queryText = query ? t('rugCatalog.querySuffix', { query }) : '';

  return (
    <section id="catalogo" className="catalog-section">
      <div className="catalog-heading">
        <div>
          {showEyebrow ? <p className="eyebrow">{t('rugCatalog.eyebrow')}</p> : null}
          <h2>{title}</h2>
        </div>
        {showCustomizationCta ? (
          <ButtonLink to={ctaTo} variant="ghost">
            {actionLabel}
          </ButtonLink>
        ) : null}
      </div>
      <p className="result-summary" aria-live="polite">
        {t(rugs.length === 1 ? 'rugCatalog.result' : 'rugCatalog.results', { count: rugs.length })}
        {categoryText}
        {queryText}
      </p>
      <div className="catalog-grid">
        {rugs.length ? rugs.map((rug) => <RugCard rug={rug} key={rug.id} />) : <EmptyState />}
      </div>
    </section>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="empty-state glass-panel">
      <h3>{t('rugCatalog.emptyTitle')}</h3>
      <p>{t('rugCatalog.emptyText')}</p>
    </div>
  );
}
