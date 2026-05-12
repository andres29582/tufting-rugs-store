import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLoginPage } from '../pages/AdminLoginPage/AdminLoginPage';
import { AdminOrdersPage } from '../pages/AdminOrdersPage/AdminOrdersPage';
import { AdminProductFormPage } from '../pages/AdminProductFormPage/AdminProductFormPage';
import { AdminProductsPage } from '../pages/AdminProductsPage/AdminProductsPage';
import { CatalogPage } from '../pages/CatalogPage/CatalogPage';
import { CustomizationSuccessPage } from '../pages/CustomizationSuccessPage/CustomizationSuccessPage';
import { CustomizePage } from '../pages/CustomizePage/CustomizePage';
import { HomePage } from '../pages/HomePage/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { ProductDetailPage } from '../pages/ProductDetailPage/ProductDetailPage';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/personalizar" element={<CustomizePage />} />
        <Route path="/como-funciona" element={<HomePage scrollTo="como-funciona" />} />
        <Route path="/solicitud/:id" element={<CustomizationSuccessPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/admin" element={<Navigate to="/admin/productos" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
        <Route path="/admin/productos" element={<AdminProductsPage />} />
        <Route path="/admin/productos/nuevo" element={<AdminProductFormPage />} />
        <Route path="/admin/productos/:id/editar" element={<AdminProductFormPage />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
