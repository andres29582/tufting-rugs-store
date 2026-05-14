import type { Customization, Order, OrderReviewPayload, OrderStatus } from '../../shared/types';
import { formatPrice } from '../../utils/money';

export type ReviewFormState = {
  status: OrderStatus;
  productionPossible: boolean;
  estimatedPrice: string;
  finalPrice: string;
  comment: string;
};

export type CustomizationBriefDetails = {
  isGuided: boolean;
  preview: string;
  productName: string;
  productId: string;
  intention: string;
  placement: string;
  visualStyle: string;
  shape: string;
  size: string;
  technicalFormat: string;
  colorsAvoid: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export const adminOrderStatusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'WAITING_ANALYSIS', label: 'Pendiente' },
  { value: 'IN_ANALYSIS', label: 'En analisis' },
  { value: 'WAITING_CUSTOMER_APPROVAL', label: 'Aprobacion cliente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'WAITING_DEPOSIT', label: 'Aguardando pago' },
  { value: 'DEPOSIT_CONFIRMED', label: 'Pago confirmado' },
  { value: 'DESIGN_APPROVED', label: 'Diseno aprobado' },
  { value: 'IN_PRODUCTION', label: 'En produccion' },
  { value: 'READY_FOR_DELIVERY', label: 'Listo para entrega' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELED', label: 'Cancelado' }
];

export function createOrderReviewForm(order: Order | null): ReviewFormState {
  return {
    status: order?.status || 'WAITING_ANALYSIS',
    productionPossible: order?.productionPossible ?? true,
    estimatedPrice: centsToInput(order?.estimatedPriceCents ?? null),
    finalPrice: centsToInput(order?.finalPriceCents ?? null),
    comment: ''
  };
}

export function buildAdminOrderReviewPayload(form: ReviewFormState): OrderReviewPayload {
  const payload: OrderReviewPayload = {
    status: form.status,
    productionPossible: form.productionPossible,
    comment: form.comment.trim() || null
  };
  const estimatedPriceCents = parseOptionalMoney(form.estimatedPrice);
  const finalPriceCents = parseOptionalMoney(form.finalPrice);

  if (estimatedPriceCents !== undefined) {
    payload.estimatedPriceCents = estimatedPriceCents;
  }

  if (finalPriceCents !== undefined) {
    payload.finalPriceCents = finalPriceCents;
  }

  return payload;
}

export function parseOptionalMoney(value: string): number | undefined {
  const normalized = value.trim().replace(',', '.');

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error('Ingresa un precio valido.');
  }

  return Math.round(parsed * 100);
}

export function centsToInput(value: number | null): string {
  return value === null ? '' : String(Math.round(value / 100));
}

export function formatOptionalOrderCents(value: number | null): string {
  return value === null ? 'Sin valor' : formatPrice(Math.round(value / 100));
}

export function getOrderProductName(order: Order): string {
  return order.product?.name || order.customization?.productId || 'Alfombra personalizada';
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return adminOrderStatusOptions.find((option) => option.value === status)?.label || status;
}

export function formatAdminDate(value: string | null): string {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function getCustomizationBriefPreview(customization: Pick<Customization, 'description'>): string {
  return getCustomizationBriefDetails(customization).preview;
}

export function getCustomizationBriefDetails(
  customization: Pick<Customization, 'description'>
): CustomizationBriefDetails {
  const lines = customization.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const details = createEmptyBriefDetails();

  if (!lines.length) {
    return {
      ...details,
      preview: 'Sin brief'
    };
  }

  let section: 'product' | 'design' | 'contact' | '' = '';

  for (const line of lines) {
    const normalizedLine = normalizeBriefKey(line);

    if (normalizedLine === 'producto base' || normalizedLine === 'produto base') {
      section = 'product';
      details.isGuided = true;
      continue;
    }

    if (normalizedLine === 'decisiones del diseno' || normalizedLine === 'decisoes do design') {
      section = 'design';
      details.isGuided = true;
      continue;
    }

    if (normalizedLine === 'contacto' || normalizedLine === 'contato') {
      section = 'contact';
      details.isGuided = true;
      continue;
    }

    const field = parseBriefField(line);

    if (field) {
      applyBriefField(details, section, field.key, field.value);
    }
  }

  if (hasStructuredBriefFields(details)) {
    details.isGuided = true;
  }

  const previewValues = [
    details.intention ? `Intencion: ${details.intention}` : '',
    details.placement ? `Uso: ${details.placement}` : '',
    details.visualStyle ? `Estilo: ${details.visualStyle}` : ''
  ].filter(Boolean);

  if (previewValues.length) {
    return {
      ...details,
      preview: previewValues.join(' - ')
    };
  }

  const legacyLines = lines[0]?.toLowerCase().startsWith('brief guiado') ? lines.slice(1) : lines;

  return {
    ...details,
    preview: legacyLines.slice(0, 3).join(' - ') || 'Sin brief'
  };
}

function createEmptyBriefDetails(): CustomizationBriefDetails {
  return {
    isGuided: false,
    preview: '',
    productName: '',
    productId: '',
    intention: '',
    placement: '',
    visualStyle: '',
    shape: '',
    size: '',
    technicalFormat: '',
    colorsAvoid: '',
    reference: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  };
}

function hasStructuredBriefFields(details: CustomizationBriefDetails): boolean {
  return Boolean(
    details.productName ||
      details.productId ||
      details.intention ||
      details.placement ||
      details.visualStyle ||
      details.shape ||
      details.size ||
      details.technicalFormat ||
      details.colorsAvoid ||
      details.reference ||
      details.customerName ||
      details.customerEmail ||
      details.customerPhone
  );
}

function parseBriefField(line: string): { key: string; value: string } | null {
  const separatorIndex = line.indexOf(':');

  if (separatorIndex < 0) {
    return null;
  }

  return {
    key: normalizeBriefKey(line.slice(0, separatorIndex)),
    value: line.slice(separatorIndex + 1).trim()
  };
}

function applyBriefField(
  details: CustomizationBriefDetails,
  section: 'product' | 'design' | 'contact' | '',
  key: string,
  value: string
): void {
  if (!value) {
    return;
  }

  if ((key === 'nombre' || key === 'nome') && section === 'product') {
    details.productName = value;
    return;
  }

  if (key === 'id' && section === 'product') {
    details.productId = value;
    return;
  }

  if (key === 'intencion' || key === 'intencao') {
    details.intention = value;
    return;
  }

  if (key === 'uso') {
    details.placement = value;
    return;
  }

  if (key === 'estilo') {
    details.visualStyle = value;
    return;
  }

  if (key === 'formato tecnico') {
    details.technicalFormat = value;
    return;
  }

  if (key === 'formato' || key === 'forma') {
    details.shape = value;
    return;
  }

  if (key === 'tamano base' || key === 'tamanho base') {
    details.size = value;
    return;
  }

  if (key === 'colores a evitar' || key === 'cores a evitar') {
    details.colorsAvoid = value;
    return;
  }

  if (key === 'referencia') {
    details.reference = value;
    return;
  }

  if ((key === 'nombre' || key === 'nome') && section === 'contact') {
    details.customerName = value;
    return;
  }

  if (key === 'email') {
    details.customerEmail = value;
    return;
  }

  if (key === 'whatsapp') {
    details.customerPhone = value;
  }
}

function normalizeBriefKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
