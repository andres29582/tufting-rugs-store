import { renderAppShell } from '../../app/AppShell.js';
import { renderFeatureStrip } from '../../components/FeatureStrip.js';
import { renderHeader } from '../../components/Header.js';
import { renderHowItWorks } from '../../components/HowItWorks.js';
import {
  loadFeaturedProducts,
  loadProductCategories,
  loadProducts
} from '../../features/products/productsService.js';
import { createHomeCatalogSection } from './sections/HomeCatalogSection.js';
import { renderHomeCustomizationSection } from './sections/HomeCustomizationSection.js';
import {
  applyShowcaseTheme,
  renderHomeShowcaseSection,
  setupShowcaseObserver
} from './sections/HomeShowcaseSection.js';

export async function renderHomePage(options = {}) {
  const rugs = await loadProducts();
  const featuredRugs = await loadFeaturedProducts({ limit: 4 });
  const categories = await loadProductCategories();
  const catalogSection = createHomeCatalogSection({ rugs, categories });
  const showcaseSection = renderHomeShowcaseSection(featuredRugs);

  applyShowcaseTheme(rugs[0]);

  const header = renderHeader({
    renderTools: catalogSection.renderHeaderTools
  });

  const shell = renderAppShell({
    header,
    children: [
      showcaseSection,
      renderFeatureStrip(),
      renderHowItWorks(),
      catalogSection.element,
      renderHomeCustomizationSection(rugs)
    ]
  });

  return {
    element: shell.element,
    destroy: shell.destroy,
    mount: function () {
      const cleanupShowcaseObserver = setupShowcaseObserver({
        rugs,
        onActiveRugChange: applyShowcaseTheme
      });
      const cleanupActions = setupActions();

      scrollToSection(options.scrollTo);

      return function cleanupHomePage() {
        if (typeof cleanupShowcaseObserver === 'function') {
          cleanupShowcaseObserver();
        }

        cleanupActions();
      };
    }
  };
}

function setupActions() {
  function handleActionClick(event) {
    const trigger = event.target.closest('[data-action]');

    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;

    if (action === 'customize' || action === 'similar') {
      const custom = document.getElementById('personalizadas');
      if (custom) {
        custom.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  document.addEventListener('click', handleActionClick);

  return function cleanupActions() {
    document.removeEventListener('click', handleActionClick);
  };
}

function scrollToSection(sectionId) {
  if (!sectionId) {
    return;
  }

  requestAnimationFrame(function () {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
