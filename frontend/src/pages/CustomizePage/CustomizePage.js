import { renderAppShell } from '../../app/AppShell.js';
import { renderHeader } from '../../components/Header.js';
import { loadProducts } from '../../features/products/productsService.js';
import { renderHomeCustomizationSection } from '../HomePage/sections/HomeCustomizationSection.js';
import { renderPageIntro } from '../shared/PageIntro.js';

export async function renderCustomizePage() {
  const rugs = await loadProducts();
  const shell = renderAppShell({
    header: renderHeader(),
    mainClassName: 'page-main',
    children: [
      renderPageIntro({
        eyebrow: 'Pedido personalizado',
        title: 'Diseñemos una alfombra contigo',
        copy:
          'Comparte medidas, colores, referencias y contexto del espacio. Con eso preparamos una propuesta clara para revisar.'
      }),
      renderHomeCustomizationSection(rugs)
    ]
  });

  return shell;
}
