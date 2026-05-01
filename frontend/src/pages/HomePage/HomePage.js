import { renderCustomRugCTA } from '../../components/CustomRugCTA.js';
import { renderFeatureStrip } from '../../components/FeatureStrip.js';
import { renderFooter } from '../../components/Footer.js';
import { renderHeader } from '../../components/Header.js';
import { renderHowItWorks } from '../../components/HowItWorks.js';
import { renderProductFilters } from '../../features/products/components/ProductFilters/ProductFilters.js';
import { renderProductSearch } from '../../features/products/components/ProductSearch/ProductSearch.js';
import { renderRugCatalog } from '../../features/products/components/RugCatalog/RugCatalog.js';
import { renderRugShowcase } from '../../features/products/components/RugShowcase/RugShowcase.js';
import {
  loadFeaturedProducts,
  loadProductCategories,
  loadProducts
} from '../../features/products/productsService.js';

export async function renderHomePage() {
  const rugs = await loadProducts();
  const featuredRugs = await loadFeaturedProducts({ limit: 4 });
  const categories = await loadProductCategories();
  const fragment = document.createDocumentFragment();
  const state = {
    query: '',
    category: 'Todas'
  };

  function applyDocumentTheme(rug) {
    if (!rug) {
      return;
    }

    const documentRoot = document.documentElement;
    documentRoot.style.setProperty('--active-a', rug.colors[0]);
    documentRoot.style.setProperty('--active-b', rug.colors[1]);
    documentRoot.style.setProperty('--active-c', rug.colors[2]);
  }

  function getFilteredRugs() {
    const normalizedQuery = state.query.trim().toLowerCase();

    return rugs.filter(function (rug) {
      const matchesName = !normalizedQuery || rug.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = state.category === 'Todas' || rug.category === state.category;

      return matchesName && matchesCategory;
    });
  }

  applyDocumentTheme(rugs[0]);

  const catalog = renderRugCatalog(rugs);
  const header = renderHeader({
    renderTools: function ({ closeMenu }) {
      const search = renderProductSearch({
        onSearch: function (query) {
          state.query = query;
          catalog.update(getFilteredRugs(), state.query, state.category);
        }
      });
      const filters = renderProductFilters({
        categories,
        onCategoryChange: function (category) {
          closeMenu();
          state.category = category;
          catalog.update(getFilteredRugs(), state.query, state.category);

          const catalogSection = document.getElementById('catalogo');
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });

      search.addEventListener('submit', closeMenu);

      return [search, filters.element];
    }
  });

  const main = document.createElement('main');
  const showcaseFlow = document.createElement('div');
  showcaseFlow.className = 'showcase-flow';

  featuredRugs.forEach(function (rug, index) {
    showcaseFlow.appendChild(
      renderRugShowcase(rug, {
        hero: index === 0,
        index
      })
    );
  });

  main.appendChild(showcaseFlow);
  main.appendChild(renderFeatureStrip());
  main.appendChild(renderHowItWorks());
  main.appendChild(catalog.element);
  main.appendChild(renderCustomRugCTA());

  fragment.appendChild(header.element);
  fragment.appendChild(main);
  fragment.appendChild(renderFooter());

  return {
    element: fragment,
    mount: function () {
      setupShowcaseObserver({
        rugs,
        onActiveRugChange: applyDocumentTheme
      });
      setupActions();
    }
  };
}

function setupShowcaseObserver({ rugs, onActiveRugChange }) {
  const sections = Array.prototype.slice.call(document.querySelectorAll('.showcase-section'));

  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        const rug = rugs.find(function (item) {
          return item.slug === entry.target.dataset.rugSlug;
        });

        if (rug) {
          onActiveRugChange(rug);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function setupActions() {
  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-action]');

    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;

    if (action === 'details') {
      const catalog = document.getElementById('catalogo');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (action === 'customize' || action === 'similar') {
      const custom = document.getElementById('personalizadas');
      if (custom) {
        custom.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
