type ProductFiltersProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export function ProductFilters({ categories, activeCategory, onCategoryChange }: ProductFiltersProps) {
  return (
    <div id="categorias" className="category-filters" role="group" aria-label="Filtrar por categoría">
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
            {category}
          </button>
        );
      })}
    </div>
  );
}
