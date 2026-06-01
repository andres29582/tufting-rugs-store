import { Fragment, type FormEvent } from 'react';
import {
  adminOrderStatusOptions,
  formatAdminDate,
  formatOptionalOrderCents,
  getCustomizationBriefDetails,
  getOrderProductName,
  getOrderStatusLabel,
  type CustomizationBriefDetails,
  type ReviewFormState
} from '../lib/adminOrderHelpers';
import type { AdminOrdersTab } from '../lib/useAdminOrdersPage';
import { Button } from '../../../shared/components/Button/Button';
import { FormField } from '../../../shared/components/FormField/FormField';
import type { AdminCustomization, Order, OrderStatus } from '../../../shared/types';

export function AdminOrderTabs({
  activeTab,
  onTabChange
}: {
  activeTab: AdminOrdersTab;
  onTabChange: (tab: AdminOrdersTab) => void;
}) {
  return (
    <div className="admin-tabs" role="tablist" aria-label="Panel admin">
      <button
        className={activeTab === 'orders' ? 'is-active' : undefined}
        type="button"
        onClick={() => onTabChange('orders')}
      >
        Pedidos
      </button>
      <button
        className={activeTab === 'customizations' ? 'is-active' : undefined}
        type="button"
        onClick={() => onTabChange('customizations')}
      >
        Solicitudes
      </button>
    </div>
  );
}

export function AdminOrderList({
  orders,
  selectedOrder,
  onSelectOrder
}: {
  orders: Order[];
  selectedOrder: Order | null;
  onSelectOrder: (orderId: string) => void;
}) {
  return (
    <div className="admin-order-list glass-panel">
      {orders.map((order) => (
        <button
          className={order.id === selectedOrder?.id ? 'admin-order-card is-selected' : 'admin-order-card'}
          type="button"
          key={order.id}
          onClick={() => onSelectOrder(order.id)}
        >
          <span>
            <strong>{order.publicCode}</strong>
            <small>{order.customerName}</small>
          </span>
          <span className="admin-card-meta">
            {getOrderProductName(order)} - {formatAdminDate(order.createdAt)}
          </span>
          <AdminOrderStatusBadge status={order.status} />
        </button>
      ))}
      {!orders.length ? <p className="admin-empty">Todavia no hay pedidos registrados.</p> : null}
    </div>
  );
}

export function AdminOrderDetail({
  selectedOrder,
  reviewForm,
  isSubmitting,
  status,
  onConfirmDeposit,
  onReviewFormChange,
  onReviewSubmit
}: {
  selectedOrder: Order | null;
  reviewForm: ReviewFormState;
  isSubmitting: boolean;
  status: string;
  onConfirmDeposit: () => void;
  onReviewFormChange: (patch: Partial<ReviewFormState>) => void;
  onReviewSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="admin-order-detail glass-panel">
      {selectedOrder ? (
        <>
          <div className="admin-order-detail-head">
            <div>
              <p className="eyebrow">Pedido</p>
              <h2>{selectedOrder.publicCode}</h2>
            </div>
            <AdminOrderStatusBadge status={selectedOrder.status} />
          </div>

          <div className="admin-detail-grid">
            <DetailItem label="Cliente" value={selectedOrder.customerName} />
            <DetailItem label="Email" value={selectedOrder.customerEmail} />
            <DetailItem label="Telefono" value={selectedOrder.customerPhone || 'Sin telefono'} />
            <DetailItem label="Producto" value={getOrderProductName(selectedOrder)} />
            <DetailItem label="Medida" value={selectedOrder.customization?.sizeLabel || selectedOrder.product?.size || 'A medida'} />
            <DetailItem label="Formato" value={selectedOrder.customization?.format || selectedOrder.product?.format || 'CUSTOM'} />
            <DetailItem label="Estimado" value={formatOptionalOrderCents(selectedOrder.estimatedPriceCents)} />
            <DetailItem label="Final" value={formatOptionalOrderCents(selectedOrder.finalPriceCents)} />
            <DetailItem label="Sena" value={formatOptionalOrderCents(selectedOrder.depositAmountCents)} />
            <DetailItem label="Pago" value={selectedOrder.depositPaid ? 'Confirmado' : 'Pendiente'} />
          </div>

          {selectedOrder.customization ? (
            <section className="admin-detail-section">
              <h3>Solicitud del cliente</h3>
              <CustomizationBriefDetail
                customization={selectedOrder.customization}
                brief={getCustomizationBriefDetails(selectedOrder.customization)}
              />
            </section>
          ) : null}

          <AdminOrderReviewForm
            isSubmitting={isSubmitting}
            reviewForm={reviewForm}
            selectedOrder={selectedOrder}
            status={status}
            onConfirmDeposit={onConfirmDeposit}
            onReviewFormChange={onReviewFormChange}
            onReviewSubmit={onReviewSubmit}
          />

          {selectedOrder.adminReviews.length ? (
            <section className="admin-detail-section">
              <h3>Historial reciente</h3>
              <div className="admin-review-history">
                {selectedOrder.adminReviews.map((review) => (
                  <article key={review.id}>
                    <strong>{review.status ? getOrderStatusLabel(review.status) : 'Revision'}</strong>
                    <span>{formatAdminDate(review.createdAt)}</span>
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
  );
}

export function AdminOrderReviewForm({
  selectedOrder,
  reviewForm,
  isSubmitting,
  status,
  onConfirmDeposit,
  onReviewFormChange,
  onReviewSubmit
}: {
  selectedOrder: Order;
  reviewForm: ReviewFormState;
  isSubmitting: boolean;
  status: string;
  onConfirmDeposit: () => void;
  onReviewFormChange: (patch: Partial<ReviewFormState>) => void;
  onReviewSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="admin-review-form" onSubmit={onReviewSubmit}>
      <h3>Actualizar pedido</h3>
      <div className="admin-form-grid">
        <label className="form-field">
          <span className="form-field-label">Estado</span>
          <select
            className="form-field-control"
            value={reviewForm.status}
            onChange={(event) =>
              onReviewFormChange({ status: event.currentTarget.value as OrderStatus })
            }
          >
            {adminOrderStatusOptions.map((option) => (
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
              onReviewFormChange({ productionPossible: event.currentTarget.checked })
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
            onReviewFormChange({ estimatedPrice: event.currentTarget.value })
          }
        />
        <FormField
          label="Precio final (R$)"
          name="finalPrice"
          type="number"
          value={reviewForm.finalPrice}
          onChange={(event) =>
            onReviewFormChange({ finalPrice: event.currentTarget.value })
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
          onReviewFormChange({ comment: event.currentTarget.value })
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
            onClick={onConfirmDeposit}
          >
            Confirmar pago
          </Button>
        ) : null}
      </div>
      <p className="admin-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

export function AdminCustomizationRequestsTable({
  customizations
}: {
  customizations: AdminCustomization[];
}) {
  return (
    <div className="admin-table-wrap glass-panel">
      <table className="admin-products-table admin-requests-table">
        <thead>
          <tr>
            <th>Solicitud</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Brief</th>
            <th>Pedido</th>
            <th>Referencia</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map((customization) => {
            const brief = getCustomizationBriefDetails(customization);

            return (
              <Fragment key={customization.id}>
                <tr>
                  <td>
                    <strong>{customization.sizeLabel || brief.size || 'A medida'}</strong>
                    <span>{formatAdminDate(customization.createdAt)}</span>
                    <span>{customization.format || brief.technicalFormat || 'CUSTOM'}</span>
                  </td>
                  <td>
                    <strong>{customization.customerName}</strong>
                    <span>{customization.customerEmail}</span>
                    <span>{customization.customerPhone || 'Sin telefono'}</span>
                  </td>
                  <td>{brief.productName || customization.product?.name || 'Sin producto'}</td>
                  <td className="admin-brief-cell">
                    <CustomizationBriefSummary brief={brief} />
                  </td>
                  <td>
                    {customization.order ? (
                      <>
                        <strong>{customization.order.publicCode}</strong>
                        <AdminOrderStatusBadge status={customization.order.status} />
                      </>
                    ) : (
                      'Sin pedido'
                    )}
                  </td>
                  <td>
                    <ReferenceLinks references={customization.designReferences} compact />
                  </td>
                </tr>
                <tr className="admin-request-detail-row">
                  <td colSpan={6}>
                    <CustomizationBriefDetail customization={customization} brief={brief} />
                  </td>
                </tr>
              </Fragment>
            );
          })}
          {!customizations.length ? (
            <tr>
              <td colSpan={6}>Todavia no hay solicitudes registradas.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function CustomizationBriefSummary({ brief }: { brief: CustomizationBriefDetails }) {
  if (!brief.isGuided) {
    return <span>{brief.preview}</span>;
  }

  return (
    <div className="admin-brief-summary">
      <strong>{brief.preview}</strong>
      <div className="admin-brief-chips" aria-label="Resumen guiado">
        {brief.shape ? <span>{brief.shape}</span> : null}
        {brief.size ? <span>{brief.size}</span> : null}
        {brief.colorsAvoid ? <span>{brief.colorsAvoid}</span> : null}
      </div>
    </div>
  );
}

function CustomizationBriefDetail({
  customization,
  brief
}: {
  customization: Pick<AdminCustomization, 'description' | 'preferredColors' | 'designReferences'>;
  brief: CustomizationBriefDetails;
}) {
  if (!brief.isGuided) {
    return (
      <div className="admin-request-detail">
        <p className="admin-brief-text">{customization.description || 'Sin descripcion adicional.'}</p>
        <p>
          <strong>Colores:</strong>{' '}
          {customization.preferredColors.length
            ? customization.preferredColors.join(', ')
            : 'Sin colores indicados'}
        </p>
        <ReferenceLinks references={customization.designReferences} />
      </div>
    );
  }

  return (
    <div className="admin-request-detail">
      <div className="admin-request-detail-head">
        <strong>Brief guiado</strong>
        <span>{brief.productName || 'Producto sin nombre'}</span>
      </div>
      <div className="admin-brief-metrics">
        <BriefMetric label="Intencion" value={brief.intention} />
        <BriefMetric label="Uso" value={brief.placement} />
        <BriefMetric label="Estilo" value={brief.visualStyle} />
        <BriefMetric label="Forma" value={brief.shape} />
        <BriefMetric label="Tamano" value={brief.size} />
        <BriefMetric label="Formato tecnico" value={brief.technicalFormat} />
        <BriefMetric label="Colores a evitar" value={brief.colorsAvoid} />
        <BriefMetric label="Referencia" value={brief.reference} />
      </div>
      <div className="admin-brief-contact">
        <span>{brief.customerName || 'Sin nombre'}</span>
        <span>{brief.customerEmail || 'Sin email'}</span>
        <span>{brief.customerPhone || 'Sin telefono'}</span>
      </div>
      <ReferenceLinks references={customization.designReferences} />
    </div>
  );
}

function BriefMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-brief-metric">
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

export function AdminOrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="admin-badge is-active" data-status={status}>
      {getOrderStatusLabel(status)}
    </span>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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
