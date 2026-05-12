import { renderProductFilters } from '../../../features/products/components/ProductFilters/ProductFilters.js';
import { renderProductSearch } from '../../../features/products/components/ProductSearch/ProductSearch.js';
import { renderRugCatalog } from '../../../features/products/components/RugCatalog/RugCatalog.js';

export function createHomeCatalogSection({ rugs, categories }) {
  const state = {
    query: '',
    category: 'Todas'
  };
  const catalog = renderRugCatalog(rugs);

  function getFilteredRugs() {
    const normalizedQuery = state.query.trim().toLowerCase();

    return rugs.filter(function (rug) {
      const matchesName = !normalizedQuery || rug.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = state.category === 'Todas' || rug.category === state.category;

      return matchesName && matchesCategory;
    });
  }

  function updateCatalog() {
    catalog.update(getFilteredRugs(), state.query, state.category);
  }

  function renderHeaderTools({ closeMenu }) {
    const search = renderProductSearch({
      onSearch: function (query) {
        state.query = query;
        updateCatalog();
      }
    });
    const filters = renderProductFilters({
      categories,
      onCategoryChange: function (category) {
        closeMenu();
        state.category = category;
        updateCatalog();
        scrollToCatalog();
      }
    });

    search.addEventListener('submit', closeMenu);

    return [search, filters.element];
  }

  return {
    element: catalog.element,
    renderHeaderTools
  };
}

function scrollToCatalog() {
  const catalogSection = document.getElementById('catalogo');

  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
