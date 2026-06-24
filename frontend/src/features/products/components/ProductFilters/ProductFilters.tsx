import { useTranslation } from '../../../../shared/i18n';
import { localizeCategory } from '../../model/productLocalization';

type ProductFiltersProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  const { language, t } = useTranslation();

  return (
    <div id="categorias" className="category-filters" role="group" aria-label={t('filters.aria')}>
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            className={isActive ? 'category-filter is-active' : 'category-filter'}
            data-category={category}
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category)}
          >
            {localizeCategory(category, language)}
          </button>
        );
      })}
    </div>
  );
}
