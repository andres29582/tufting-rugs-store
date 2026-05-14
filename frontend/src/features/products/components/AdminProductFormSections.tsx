import type { ChangeEvent } from 'react';
import {
  slugifyAdminProduct,
  type ProductFormState
} from '../adminProductFormHelpers';
import { Button } from '../../../shared/components/Button/Button';
import { FormField } from '../../../shared/components/FormField/FormField';
import type { ProductType, RugFormat, SizeCategory } from '../../../shared/types';

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

type ProductFormPatch = Partial<ProductFormState>;

export function AdminProductFields({
  form,
  slugPreview,
  onChange
}: {
  form: ProductFormState;
  slugPreview: string;
  onChange: (patch: ProductFormPatch) => void;
}) {
  return (
    <>
      <div className="admin-form-grid">
        <FormField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={(event) => onChange({ name: event.currentTarget.value })}
        />
        <FormField
          label="Slug"
          name="slug"
          value={form.slug}
          placeholder={slugPreview}
          onChange={(event) => onChange({ slug: slugifyAdminProduct(event.currentTarget.value) })}
        />
        <SelectField
          label="Tipo"
          name="type"
          value={form.type}
          options={typeOptions}
          onChange={(value) => onChange({ type: value })}
        />
        <FormField
          label="Precio base (R$)"
          name="basePrice"
          type="number"
          value={form.basePrice}
          onChange={(event) => onChange({ basePrice: event.currentTarget.value })}
        />
        <FormField
          label="Categoria"
          name="category"
          value={form.category}
          onChange={(event) => onChange({ category: event.currentTarget.value })}
        />
        <FormField
          label="Medida visible"
          name="sizeLabel"
          value={form.sizeLabel}
          onChange={(event) => onChange({ sizeLabel: event.currentTarget.value })}
        />
        <SelectField
          label="Tamano"
          name="sizeCategory"
          value={form.sizeCategory}
          options={sizeOptions}
          onChange={(value) => onChange({ sizeCategory: value })}
        />
        <SelectField
          label="Formato"
          name="format"
          value={form.format}
          options={formatOptions}
          onChange={(value) => onChange({ format: value })}
        />
        <FormField
          label="Material"
          name="material"
          value={form.material}
          onChange={(event) => onChange({ material: event.currentTarget.value })}
        />
        <FormField
          label="Tiempo de produccion"
          name="productionTime"
          value={form.productionTime}
          placeholder="Ej: 12 a 18 dias"
          onChange={(event) => onChange({ productionTime: event.currentTarget.value })}
        />
      </div>
      <FormField
        as="textarea"
        label="Descripcion"
        name="description"
        value={form.description}
        rows={4}
        onChange={(event) => onChange({ description: event.currentTarget.value })}
      />
      <div className="admin-form-grid">
        <FormField
          as="textarea"
          label="Colores"
          name="colors"
          value={form.colorsText}
          rows={5}
          placeholder="#1d2b53, #f97316, #db5c91"
          onChange={(event) => onChange({ colorsText: event.currentTarget.value })}
        />
        <FormField
          as="textarea"
          label="Caracteristicas"
          name="features"
          value={form.featuresText}
          rows={5}
          placeholder="Hecha a mano&#10;Base antiderrapante"
          onChange={(event) => onChange({ featuresText: event.currentTarget.value })}
        />
      </div>
      <div className="admin-check-grid">
        <CheckboxField
          label="Personalizable"
          checked={form.isCustomizable}
          onChange={(checked) => onChange({ isCustomizable: checked })}
        />
        <CheckboxField
          label="Destacada"
          checked={form.isFeatured}
          onChange={(checked) => onChange({ isFeatured: checked })}
        />
        <CheckboxField
          label="Publicada en el frontend"
          checked={form.isActive}
          onChange={(checked) => onChange({ isActive: checked })}
        />
      </div>
    </>
  );
}

export function AdminProductImageUpload({
  imageUrl,
  imagePreviewUrl,
  isUploading,
  uploadStatus,
  onChange,
  onClearImage,
  onImageUpload
}: {
  imageUrl: string;
  imagePreviewUrl: string;
  isUploading: boolean;
  uploadStatus: string;
  onChange: (patch: ProductFormPatch) => void;
  onClearImage: () => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <FormField
        label="Imagen principal"
        name="imageUrl"
        type="url"
        value={imageUrl}
        placeholder="https://..."
        onChange={(event) => onChange({ imageUrl: event.currentTarget.value })}
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
            onChange={onImageUpload}
          />
          <small className="form-field-error" aria-live="polite">
            {uploadStatus}
          </small>
        </label>
        {imageUrl ? (
          <div className="admin-image-preview">
            <img src={imagePreviewUrl} alt="Vista previa de la alfombra" />
            <Button type="button" variant="ghost" onClick={onClearImage}>
              Quitar imagen
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export function AdminProductFormActions({
  isSubmitting,
  status
}: {
  isSubmitting: boolean;
  status: string;
}) {
  return (
    <div className="admin-form-footer">
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar producto'}
      </Button>
      <AdminProductFormStatus status={status} />
    </div>
  );
}

export function AdminProductFormStatus({ status }: { status: string }) {
  return (
    <p className="admin-status" aria-live="polite">
      {status}
    </p>
  );
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
