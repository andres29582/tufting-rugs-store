import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CatalogPage } from '../pages/CatalogPage/CatalogPage';
import { CustomizationSuccessPage } from '../pages/CustomizationSuccessPage/CustomizationSuccessPage';
import { CustomizePage } from '../pages/CustomizePage/CustomizePage';
import { HomePage } from '../pages/HomePage/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { ProductDetailPage } from '../pages/ProductDetailPage/ProductDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/personalizar" element={<CustomizePage />} />
        <Route path="/como-funciona" element={<HomePage scrollTo="como-funciona" />} />
        <Route path="/solicitud/:id" element={<CustomizationSuccessPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
