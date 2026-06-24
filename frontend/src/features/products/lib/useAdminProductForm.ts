import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminToken } from '../../admin/lib/adminAuth';
import {
  createAdminProduct,
  getAdminProductById,
  updateAdminProduct,
  uploadAdminProductImage,
} from '../api/productsApi';
import {
  createInitialProductForm,
  mapAdminProductFormToPayload,
  mapProductToAdminForm,
  slugifyAdminProduct,
  type ProductFormState,
} from './adminProductFormHelpers';

export function useAdminProductForm(productId: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(productId);
  const [form, setForm] = useState<ProductFormState>(() => createInitialProductForm());
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [status, setStatus] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const title = isEditing ? 'Editar alfombra' : 'Nueva alfombra';
  const slugPreview = useMemo(
    () => form.slug || slugifyAdminProduct(form.name),
    [form.name, form.slug]
  );

  const loadProduct = useCallback(() => {
    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return undefined;
    }

    if (!isEditing) {
      return undefined;
    }

    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    void getAdminProductById(productId, token)
      .then((product) => {
        if (isCurrent) {
          setForm(mapProductToAdminForm(product));
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [isEditing, navigate, productId]);

  useEffect(() => loadProduct(), [loadProduct]);

  const updateForm = useCallback((patch: Partial<ProductFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const submitProduct = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setStatus('');
    setIsSubmitting(true);

    try {
      const payload = mapAdminProductFormToPayload({
        ...form,
        slug: slugPreview,
      });

      if (isEditing) {
        await updateAdminProduct(productId, payload, token);
        setStatus('Producto actualizado.');
      } else {
        await createAdminProduct(payload, token);
        navigate('/admin/productos');
      }
    } catch (submitError) {
      setStatus(
        submitError instanceof Error ? submitError.message : 'No se pudo guardar el producto.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isEditing, navigate, productId, slugPreview]);

  const uploadProductImage = useCallback(
    async (file: File | null | undefined) => {
      if (!file) {
        return;
      }

      const token = getAdminToken();

      if (!token) {
        navigate('/admin/login', { replace: true });
        return;
      }

      setUploadStatus('');
      setIsUploading(true);

      try {
        const upload = await uploadAdminProductImage(file, token);
        updateForm({ imageUrl: upload.url });
        setUploadStatus('Imagen subida correctamente.');
      } catch (uploadError) {
        setUploadStatus(
          uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.'
        );
      } finally {
        setIsUploading(false);
      }
    },
    [navigate, updateForm]
  );

  const clearImage = useCallback(() => {
    updateForm({ imageUrl: '' });
  }, [updateForm]);

  return {
    error,
    form,
    isEditing,
    isLoading,
    isSubmitting,
    isUploading,
    loadProduct,
    clearImage,
    slugPreview,
    status,
    submitProduct,
    title,
    updateForm,
    uploadProductImage,
    uploadStatus,
  };
}
