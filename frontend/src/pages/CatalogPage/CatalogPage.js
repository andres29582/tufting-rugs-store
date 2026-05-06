import { renderAppShell } from '../../app/AppShell.js';
import { renderHeader } from '../../components/Header.js';
import {
  loadProductCategories,
  loadProducts
} from '../../features/products/productsService.js';
import { createHomeCatalogSection } from '../HomePage/sections/HomeCatalogSection.js';
import { renderPageIntro } from '../shared/PageIntro.js';

export async function renderCatalogPage() {
  const rugs = await loadProducts();
  const categories = await loadProductCategories();
  const catalogSection = createHomeCatalogSection({ rugs, categories });
  const header = renderHeader({
    renderTools: catalogSection.renderHeaderTools
  });
  const shell = renderAppShell({
    header,
    mainClassName: 'page-main',
    children: [
      renderPageIntro({
        eyebrow: 'Catálogo',
        title: 'Explora alfombras listas para inspirar',
        copy:
          'Busca por nombre, filtra por estilo y elige una base visual para tu próxima pieza personalizada.'
      }),
      catalogSection.element
    ]
  });

  return shell;
}
