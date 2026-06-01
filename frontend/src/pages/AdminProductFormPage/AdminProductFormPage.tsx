import type { ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import {
  AdminProductFields,
  AdminProductFormActions,
  AdminProductImageUpload
} from '../../features/products/components/AdminProductFormSections';
import { useAdminProductForm } from '../../features/products/lib/useAdminProductForm';
import { ButtonLink } from '../../shared/components/Button/Button';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';
import { resolveApiAssetUrl } from '../../shared/api/assets';

export function AdminProductFormPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id || '';
  const {
    clearImage,
    error,
    form,
    isLoading,
    isSubmitting,
    isUploading,
    loadProduct,
    slugPreview,
    status,
    submitProduct,
    title,
    updateForm,
    uploadProductImage,
    uploadStatus
  } = useAdminProductForm(productId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitProduct();
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    await uploadProductImage(file);
    input.value = '';
  }

  if (isLoading) {
    return <AppLoadingState title="Preparando producto" />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error)} onAction={loadProduct} />;
  }

  return (
    <AppShell mainClassName="admin-main">
      <section className="admin-section">
        <div className="admin-page-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>{title}</h1>
            <p>Los cambios publicados aparecen en el catalogo publico.</p>
          </div>
          <ButtonLink to="/admin/productos" variant="ghost">
            Volver
          </ButtonLink>
        </div>
        <form className="admin-product-form glass-panel" onSubmit={handleSubmit}>
          <AdminProductFields form={form} slugPreview={slugPreview} onChange={updateForm} />
          <AdminProductImageUpload
            imagePreviewUrl={form.imageUrl ? resolveApiAssetUrl(form.imageUrl) : ''}
            imageUrl={form.imageUrl}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            onChange={updateForm}
            onClearImage={clearImage}
            onImageUpload={(event) => void handleImageUpload(event)}
          />
          <AdminProductFormActions isSubmitting={isSubmitting} status={status} />
        </form>
      </section>
    </AppShell>
  );
}
