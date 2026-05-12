import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../app/AppShell';
import { clearAdminToken, getAdminToken } from '../../features/admin/adminAuth';
import { getAdminCustomizations } from '../../features/customizations/customizationsApi';
import {
  confirmAdminOrderDeposit,
  getAdminOrders,
  reviewAdminOrder
} from '../../features/orders/ordersApi';
import { Button, ButtonLink } from '../../shared/components/Button/Button';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';
import { FormField } from '../../shared/components/FormField/FormField';
import type { AdminCustomization, Order, OrderReviewPayload, OrderStatus } from '../../shared/types';
import { formatPrice } from '../../utils/money';

type ReviewFormState = {
  status: OrderStatus;
  productionPossible: boolean;
  estimatedPrice: string;
  finalPrice: string;
  comment: string;
};

type AdminTab = 'orders' | 'customizations';

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
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

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customizations, setCustomizations] = useState<AdminCustomization[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [status, setStatus] = useState('');
  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || orders[0] || null,
    [orders, selectedOrderId]
  );
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(() => createReviewForm(null));

  const loadPage = useCallback(() => {
    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return undefined;
    }

    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    void Promise.all([getAdminOrders(token), getAdminCustomizations(token)])
      .then(([loadedOrders, loadedCustomizations]) => {
        if (!isCurrent) {
          return;
        }

        setOrders(loadedOrders);
        setCustomizations(loadedCustomizations);
        setSelectedOrderId((current) => current || loadedOrders[0]?.id || '');
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
  }, [navigate]);

  useEffect(() => loadPage(), [loadPage]);

  useEffect(() => {
    setReviewForm(createReviewForm(selectedOrder));
  }, [selectedOrder]);

  async function handleReviewSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOrder) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setStatus('');
    setIsSubmitting(true);

    try {
      const payload = buildReviewPayload(reviewForm);
      const updatedOrder = await reviewAdminOrder(selectedOrder.id, payload, token);
      replaceOrder(updatedOrder);
      setStatus('Pedido actualizado.');
    } catch (reviewError) {
      setStatus(reviewError instanceof Error ? reviewError.message : 'No se pudo actualizar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDeposit() {
    if (!selectedOrder) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setStatus('');
    setIsSubmitting(true);

    try {
      const updatedOrder = await confirmAdminOrderDeposit(selectedOrder.id, token);
      replaceOrder(updatedOrder);
      setStatus('Pago confirmado.');
    } catch (depositError) {
      setStatus(depositError instanceof Error ? depositError.message : 'No se pudo confirmar el pago.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function replaceOrder(updatedOrder: Order) {
    setOrders((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
    setSelectedOrderId(updatedOrder.id);
  }

  function handleLogout() {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }

  if (isLoading) {
    return <AppLoadingState title="Preparando pedidos" />;
  }

  if (error) {
    return <AppErrorState message={getFriendlyErrorMessage(error)} onAction={loadPage} />;
  }

  return (
    <AppShell mainClassName="admin-main">
      <section className="admin-section">
        <div className="admin-page-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Pedidos y solicitudes</h1>
            <p>Revisa pedidos enviados, referencias, precios y estados de produccion.</p>
          </div>
          <div className="admin-page-actions">
            <ButtonLink to="/admin/productos" variant="secondary">
              Productos
            </ButtonLink>
            <Button type="button" variant="ghost" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Panel admin">
          <button
            className={activeTab === 'orders' ? 'is-active' : undefined}
            type="button"
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
          <button
            className={activeTab === 'customizations' ? 'is-active' : undefined}
            type="button"
            onClick={() => setActiveTab('customizations')}
          >
            Solicitudes
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="admin-orders-layout">
            <div className="admin-order-list glass-panel">
              {orders.map((order) => (
                <button
                  className={order.id === selectedOrder?.id ? 'admin-order-card is-selected' : 'admin-order-card'}
                  type="button"
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <span>
                    <strong>{order.publicCode}</strong>
                    <small>{order.customerName}</small>
                  </span>
                  <span className="admin-card-meta">
                    {getProductName(order)} · {formatDate(order.createdAt)}
                  </span>
                  <StatusBadge status={order.status} />
                </button>
              ))}
              {!orders.length ? <p className="admin-empty">Todavia no hay pedidos registrados.</p> : null}
            </div>

            <div className="admin-order-detail glass-panel">
              {selectedOrder ? (
                <>
                  <div className="admin-order-detail-head">
                    <div>
                      <p className="eyebrow">Pedido</p>
                      <h2>{selectedOrder.publicCode}</h2>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>

                  <div className="admin-detail-grid">
                    <DetailItem label="Cliente" value={selectedOrder.customerName} />
                    <DetailItem label="Email" value={selectedOrder.customerEmail} />
                    <DetailItem label="Telefono" value={selectedOrder.customerPhone || 'Sin telefono'} />
                    <DetailItem label="Producto" value={getProductName(selectedOrder)} />
                    <DetailItem label="Medida" value={selectedOrder.customization?.sizeLabel || selectedOrder.product?.size || 'A medida'} />
                    <DetailItem label="Formato" value={selectedOrder.customization?.format || selectedOrder.product?.format || 'CUSTOM'} />
                    <DetailItem label="Estimado" value={formatOptionalCents(selectedOrder.estimatedPriceCents)} />
                    <DetailItem label="Final" value={formatOptionalCents(selectedOrder.finalPriceCents)} />
                    <DetailItem label="Sena" value={formatOptionalCents(selectedOrder.depositAmountCents)} />
                    <DetailItem label="Pago" value={selectedOrder.depositPaid ? 'Confirmado' : 'Pendiente'} />
                  </div>

                  {selectedOrder.customization ? (
                    <section className="admin-detail-section">
                      <h3>Solicitud del cliente</h3>
                      <p>{selectedOrder.customization.description || 'Sin descripcion adicional.'}</p>
                      <p>
                        <strong>Colores:</strong>{' '}
                        {selectedOrder.customization.preferredColors.length
                          ? selectedOrder.customization.preferredColors.join(', ')
                          : 'Sin colores indicados'}
                      </p>
                      <ReferenceLinks references={selectedOrder.customization.designReferences} />
                    </section>
                  ) : null}

                  <form className="admin-review-form" onSubmit={handleReviewSubmit}>
                    <h3>Actualizar pedido</h3>
                    <div className="admin-form-grid">
                      <label className="form-field">
                        <span className="form-field-label">Estado</span>
                        <select
                          className="form-field-control"
                          value={reviewForm.status}
                          onChange={(event) =>
                            setReviewForm((current) => ({
                              ...current,
                              status: event.currentTarget.value as OrderStatus
                            }))
                          }
                        >
                          {statusOptions.map((option) => (
                            <option value={option.value} key={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <small className="form-field-error" />
                      </label>
                      <label className="admin-checkbox admin-checkbox-inline">
                        <input
                          type="checkbox"
                          checked={reviewForm.productionPossible}
                          onChange={(event) =>
                            setReviewForm((current) => ({
                              ...current,
                              productionPossible: event.currentTarget.checked
                            }))
                          }
                        />
                        <span>Produccion viable</span>
                      </label>
                      <FormField
                        label="Precio estimado (R$)"
                        name="estimatedPrice"
                        type="number"
                        value={reviewForm.estimatedPrice}
                        onChange={(event) =>
                          setReviewForm((current) => ({
                            ...current,
                            estimatedPrice: event.currentTarget.value
                          }))
                        }
                      />
                      <FormField
                        label="Precio final (R$)"
                        name="finalPrice"
                        type="number"
                        value={reviewForm.finalPrice}
                        onChange={(event) =>
                          setReviewForm((current) => ({
                            ...current,
                            finalPrice: event.currentTarget.value
                          }))
                        }
                      />
                    </div>
                    <FormField
                      as="textarea"
                      label="Comentario interno"
                      name="comment"
                      value={reviewForm.comment}
                      rows={4}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          comment: event.currentTarget.value
                        }))
                      }
                    />
                    <div className="admin-form-footer">
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar revision'}
                      </Button>
                      {selectedOrder.status === 'WAITING_DEPOSIT' ? (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isSubmitting}
                          onClick={() => void handleConfirmDeposit()}
                        >
                          Confirmar pago
                        </Button>
                      ) : null}
                    </div>
                    <p className="admin-status" aria-live="polite">
                      {status}
                    </p>
                  </form>

                  {selectedOrder.adminReviews.length ? (
                    <section className="admin-detail-section">
                      <h3>Historial reciente</h3>
                      <div className="admin-review-history">
                        {selectedOrder.adminReviews.map((review) => (
                          <article key={review.id}>
                            <strong>{review.status ? getStatusLabel(review.status) : 'Revision'}</strong>
                            <span>{formatDate(review.createdAt)}</span>
                            <p>{review.comment || 'Sin comentario.'}</p>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </>
              ) : (
                <p className="admin-empty">Selecciona un pedido para ver detalles.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-table-wrap glass-panel">
            <table className="admin-products-table admin-requests-table">
              <thead>
                <tr>
                  <th>Solicitud</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Pedido</th>
                  <th>Referencia</th>
                </tr>
              </thead>
              <tbody>
                {customizations.map((customization) => (
                  <tr key={customization.id}>
                    <td>
                      <strong>{customization.sizeLabel || 'A medida'}</strong>
                      <span>{formatDate(customization.createdAt)}</span>
                    </td>
                    <td>
                      <strong>{customization.customerName}</strong>
                      <span>{customization.customerEmail}</span>
                    </td>
                    <td>{customization.product?.name || 'Sin producto'}</td>
                    <td>
                      {customization.order ? (
                        <>
                          <strong>{customization.order.publicCode}</strong>
                          <StatusBadge status={customization.order.status} />
                        </>
                      ) : (
                        'Sin pedido'
                      )}
                    </td>
                    <td>
                      <ReferenceLinks references={customization.designReferences} compact />
                    </td>
                  </tr>
                ))}
                {!customizations.length ? (
                  <tr>
                    <td colSpan={5}>Todavia no hay solicitudes registradas.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function createReviewForm(order: Order | null): ReviewFormState {
  return {
    status: order?.status || 'WAITING_ANALYSIS',
    productionPossible: order?.productionPossible ?? true,
    estimatedPrice: centsToInput(order?.estimatedPriceCents ?? null),
    finalPrice: centsToInput(order?.finalPriceCents ?? null),
    comment: ''
  };
}

function buildReviewPayload(form: ReviewFormState): OrderReviewPayload {
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

function parseOptionalMoney(value: string): number | undefined {
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

function centsToInput(value: number | null): string {
  return value === null ? '' : String(Math.round(value / 100));
}

function formatOptionalCents(value: number | null): string {
  return value === null ? 'Sin valor' : formatPrice(Math.round(value / 100));
}

function getProductName(order: Order): string {
  return order.product?.name || order.customization?.productId || 'Alfombra personalizada';
}

function getStatusLabel(status: OrderStatus): string {
  return statusOptions.find((option) => option.value === status)?.label || status;
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="admin-badge is-active" data-status={status}>
      {getStatusLabel(status)}
    </span>
  );
}

function ReferenceLinks({
  references,
  compact
}: {
  references: Array<{ url: string; originalName?: string | null }>;
  compact?: boolean;
}) {
  if (!references.length) {
    return <span className="admin-muted">Sin referencia</span>;
  }

  return (
    <div className={compact ? 'admin-reference-links is-compact' : 'admin-reference-links'}>
      {references.map((reference, index) => (
        <a href={reference.url} target="_blank" rel="noreferrer" key={reference.url + index}>
          {reference.originalName || 'Referencia ' + (index + 1)}
        </a>
      ))}
    </div>
  );
}
