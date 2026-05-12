import { renderRugShowcase } from '../../../features/products/components/RugShowcase/RugShowcase.js';

export function renderHomeShowcaseSection(featuredRugs) {
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

  return showcaseFlow;
}

export function applyShowcaseTheme(rug) {
  if (!rug) {
    return;
  }

  const documentRoot = document.documentElement;
  documentRoot.style.setProperty('--active-a', rug.colors[0]);
  documentRoot.style.setProperty('--active-b', rug.colors[1]);
  documentRoot.style.setProperty('--active-c', rug.colors[2]);
}

export function setupShowcaseObserver({ rugs, onActiveRugChange }) {
  const sections = Array.prototype.slice.call(document.querySelectorAll('.showcase-section'));

  if (!('IntersectionObserver' in window)) {
    return null;
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

  return function cleanupShowcaseObserver() {
    observer.disconnect();
  };
}
