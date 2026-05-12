import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import { getAdminToken } from '../../features/admin/adminAuth';
import {
  createAdminProduct,
  getAdminProductById,
  updateAdminProduct,
  uploadAdminProductImage
} from '../../features/products/productsApi';
import { Button, ButtonLink } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';
import type { AdminProductPayload, Product, ProductType, RugFormat, SizeCategory } from '../../shared/types';
import { resolveApiAssetUrl } from '../../shared/api/assets';

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  basePrice: string;
  category: string;
  sizeCategory: SizeCategory;
  sizeLabel: string;
  format: RugFormat;
  imageUrl: string;
  colorsText: string;
  featuresText: string;
  material: string;
  productionTime: string;
  isCustomizable: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

const typeOptions: Array<{ label: string; value: ProductType }> = [
  { label: 'Alfombra lista', value: 'READY_MADE' },
  { label: '100% personalizada', value: 'FULL_CUSTOM' }
];

const sizeOptions: Array<{ label: string; value: SizeCategory }> = [
  { label: 'Pequena', value: 'SMALL' },
  { label: 'Media', value: 'MEDIUM' },
  { label: 'Grande', value: 'LARGE' },
  { label: 'A medida', value: 'CUSTOM' }
];

const formatOptions: Array<{ label: string; value: RugFormat }> = [
  { label: 'Rectangular', value: 'RECTANGULAR' },
  { label: 'Redonda', value: 'ROUND' },
  { label: 'Organica', value: 'ORGANIC' },
  { label: 'Personalizada', value: 'CUSTOM' }
];

export function AdminProductFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = params.id || '';
  const isEditing = Boolean(productId);
  const [form, setForm] = useState<ProductFormState>(() => createInitialForm());
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [status, setStatus] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const title = isEditing ? 'Editar alfombra' : 'Nueva alfombra';
  const slugPreview = useMemo(() => form.slug || slugify(form.name), [form.name, form.slug]);

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
          setForm(productToForm(product));
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

  function updateForm(patch: Partial<ProductFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setStatus('');
    setIsSubmitting(true);

    try {
      const payload = formToPayload({
        ...form,
        slug: slugPreview
      });

      if (isEditing) {
        await updateAdminProduct(productId, payload, token);
        setStatus('Producto actualizado.');
      } else {
        await createAdminProduct(payload, token);
        navigate('/admin/productos');
      }
    } catch (submitError) {
      setStatus(submitError instanceof Error ? submitError.message : 'No se pudo guardar el producto.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

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
      setUploadStatus(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.');
    } finally {
      setIsUploading(false);
      event.currentTarget.value = '';
    }
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
          <div className="admin-form-grid">
            <FormField
              label="Nombre"
              name="name"
              value={form.name}
              onChange={(event) => updateForm({ name: event.currentTarget.value })}
            />
            <FormField
              label="Slug"
              name="slug"
              value={form.slug}
              placeholder={slugPreview}
              onChange={(event) => updateForm({ slug: slugify(event.currentTarget.value) })}
            />
            <SelectField
              label="Tipo"
              name="type"
              value={form.type}
              options={typeOptions}
              onChange={(value) => updateForm({ type: value })}
            />
            <FormField
              label="Precio base (R$)"
              name="basePrice"
              type="number"
              value={form.basePrice}
              onChange={(event) => updateForm({ basePrice: event.currentTarget.value })}
            />
            <FormField
              label="Categoria"
              name="category"
              value={form.category}
              onChange={(event) => updateForm({ category: event.currentTarget.value })}
            />
            <FormField
              label="Medida visible"
              name="sizeLabel"
              value={form.sizeLabel}
              onChange={(event) => updateForm({ sizeLabel: event.currentTarget.value })}
            />
            <SelectField
              label="Tamano"
              name="sizeCategory"
              value={form.sizeCategory}
              options={sizeOptions}
              onChange={(value) => updateForm({ sizeCategory: value })}
            />
            <SelectField
              label="Formato"
              name="format"
              value={form.format}
              options={formatOptions}
              onChange={(value) => updateForm({ format: value })}
            />
            <FormField
              label="Material"
              name="material"
              value={form.material}
              onChange={(event) => updateForm({ material: event.currentTarget.value })}
            />
            <FormField
              label="Tiempo de produccion"
              name="productionTime"
              value={form.productionTime}
              placeholder="Ej: 12 a 18 dias"
              onChange={(event) => updateForm({ productionTime: event.currentTarget.value })}
            />
          </div>
          <FormField
            label="Imagen principal"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            placeholder="https://..."
            onChange={(event) => updateForm({ imageUrl: event.currentTarget.value })}
          />
          <div className="admin-upload-row">
            <label className="form-field admin-upload-field">
              <span className="form-field-label">Subir imagen</span>
              <input
                className="form-field-control"
                name="productImage"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={isUploading}
                onChange={(event) => void handleImageUpload(event)}
              />
              <small className="form-field-error" aria-live="polite">
                {uploadStatus}
              </small>
            </label>
            {form.imageUrl ? (
              <div className="admin-image-preview">
                <img src={resolveApiAssetUrl(form.imageUrl)} alt="Vista previa de la alfombra" />
                <Button type="button" variant="ghost" onClick={() => updateForm({ imageUrl: '' })}>
                  Quitar imagen
                </Button>
              </div>
            ) : null}
          </div>
          <FormField
            as="textarea"
            label="Descripcion"
            name="description"
            value={form.description}
            rows={4}
            onChange={(event) => updateForm({ description: event.currentTarget.value })}
          />
          <div className="admin-form-grid">
            <FormField
              as="textarea"
              label="Colores"
              name="colors"
              value={form.colorsText}
              rows={5}
              placeholder="#1d2b53, #f97316, #db5c91"
              onChange={(event) => updateForm({ colorsText: event.currentTarget.value })}
            />
            <FormField
              as="textarea"
              label="Caracteristicas"
              name="features"
              value={form.featuresText}
              rows={5}
              placeholder="Hecha a mano&#10;Base antiderrapante"
              onChange={(event) => updateForm({ featuresText: event.currentTarget.value })}
            />
          </div>
          <div className="admin-check-grid">
            <CheckboxField
              label="Personalizable"
              checked={form.isCustomizable}
              onChange={(checked) => updateForm({ isCustomizable: checked })}
            />
            <CheckboxField
              label="Destacada"
              checked={form.isFeatured}
              onChange={(checked) => updateForm({ isFeatured: checked })}
            />
            <CheckboxField
              label="Publicada en el frontend"
              checked={form.isActive}
              onChange={(checked) => updateForm({ isActive: checked })}
            />
          </div>
          <div className="admin-form-footer">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar producto'}
            </Button>
            <p className="admin-status" aria-live="polite">
              {status}
            </p>
          </div>
        </form>
      </section>
    </AppShell>
  );
}

function createInitialForm(): ProductFormState {
  return {
    name: '',
    slug: '',
    description: '',
    type: 'READY_MADE',
    basePrice: '',
    category: 'Decorativas',
    sizeCategory: 'MEDIUM',
    sizeLabel: '100 x 80 cm',
    format: 'RECTANGULAR',
    imageUrl: '',
    colorsText: '#1d2b53\n#f97316\n#db5c91',
    featuresText: 'Hecha a mano\nMaterial premium\nBase antiderrapante',
    material: 'Lana acrilica',
    productionTime: '12 a 18 dias',
    isCustomizable: true,
    isFeatured: false,
    isActive: false
  };
}

function productToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    type: product.type || 'READY_MADE',
    basePrice: String(product.priceFrom),
    category: product.category,
    sizeCategory: product.sizeCategory,
    sizeLabel: product.size,
    format: product.format,
    imageUrl: product.imageUrl,
    colorsText: product.colors.join('\n'),
    featuresText: product.features.join('\n'),
    material: product.material,
    productionTime: product.productionTime,
    isCustomizable: product.isCustomizable,
    isFeatured: product.isFeatured,
    isActive: product.isActive
  };
}

function formToPayload(form: ProductFormState): AdminProductPayload {
  const basePrice = Number(String(form.basePrice).replace(',', '.'));

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error('Ingresa un precio base valido.');
  }

  return {
    name: form.name.trim(),
    slug: slugify(form.slug || form.name),
    description: optionalText(form.description),
    type: form.type,
    basePriceCents: Math.round(basePrice * 100),
    sizeCategory: form.sizeCategory,
    sizeLabel: form.sizeLabel.trim(),
    format: form.format,
    category: optionalText(form.category),
    imageUrl: optionalText(form.imageUrl),
    colors: splitList(form.colorsText),
    features: splitList(form.featuresText),
    material: optionalText(form.material),
    productionTime: optionalText(form.productionTime),
    isCustomizable: form.isCustomizable,
    isFeatured: form.isFeatured,
    isActive: form.isActive
  };
}

function optionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function splitList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function SelectField<T extends string>({
  label,
  name,
  value,
  options,
  onChange
}: {
  label: string;
  name: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <label className="form-field">
      <span className="form-field-label">{label}</span>
      <select
        className="form-field-control"
        name={name}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value as T)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <small className="form-field-error" />
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="admin-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
