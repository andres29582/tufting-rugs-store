import type { FormEvent } from 'react';
import { AppShell } from '../../app/AppShell';
import {
  AdminCustomizationRequestsTable,
  AdminOrderDetail,
  AdminOrderList,
  AdminOrderTabs
} from '../../features/orders/components/AdminOrdersSections';
import { useAdminOrdersPage } from '../../features/orders/lib/useAdminOrdersPage';
import { Button, ButtonLink } from '../../shared/components/Button/Button';
import {
  AppErrorState,
  AppLoadingState,
  getFriendlyErrorMessage
} from '../../shared/components/AppState/AppState';

export function AdminOrdersPage() {
  const {
    activeTab,
    confirmDeposit,
    customizations,
    error,
    isLoading,
    isSubmitting,
    loadPage,
    logout,
    orders,
    reviewForm,
    selectedOrder,
    setActiveTab,
    setSelectedOrderId,
    status,
    submitReview,
    updateReviewForm
  } = useAdminOrdersPage();

  function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitReview();
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
            <Button type="button" variant="ghost" onClick={logout}>
              Salir
            </Button>
          </div>
        </div>

        <AdminOrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'orders' ? (
          <div className="admin-orders-layout">
            <AdminOrderList
              orders={orders}
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrderId}
            />
            <AdminOrderDetail
              isSubmitting={isSubmitting}
              reviewForm={reviewForm}
              selectedOrder={selectedOrder}
              status={status}
              onConfirmDeposit={() => void confirmDeposit()}
              onReviewFormChange={updateReviewForm}
              onReviewSubmit={handleReviewSubmit}
            />
          </div>
        ) : (
          <AdminCustomizationRequestsTable customizations={customizations} />
        )}
      </section>
    </AppShell>
  );
}
