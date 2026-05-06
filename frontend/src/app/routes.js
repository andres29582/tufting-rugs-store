import { renderCatalogPage } from '../pages/CatalogPage/CatalogPage.js';
import { renderCustomizationSuccessPage } from '../pages/CustomizationSuccessPage/CustomizationSuccessPage.js';
import { renderCustomizePage } from '../pages/CustomizePage/CustomizePage.js';
import { renderHomePage } from '../pages/HomePage/HomePage.js';
import { renderNotFoundPage } from '../pages/NotFoundPage/NotFoundPage.js';
import { renderProductDetailPage } from '../pages/ProductDetailPage/ProductDetailPage.js';

export const appRoutes = [
  {
    path: '/',
    title: 'Inicio',
    render: renderHomePage
  },
  {
    path: '/catalogo',
    title: 'Catálogo',
    render: renderCatalogPage
  },
  {
    path: '/personalizar',
    title: 'Personalizar',
    render: renderCustomizePage
  },
  {
    path: '/como-funciona',
    title: 'Cómo funciona',
    render: function () {
      return renderHomePage({ scrollTo: 'como-funciona' });
    }
  },
  {
    path: '/solicitud/:id',
    title: 'Solicitud enviada',
    render: renderCustomizationSuccessPage
  },
  {
    path: '/producto/:slug',
    title: 'Detalle',
    render: renderProductDetailPage
  },
  {
    path: '*',
    title: 'Página no encontrada',
    render: renderNotFoundPage
  }
];
