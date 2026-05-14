import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAdminToken, getAdminToken } from '../admin/adminAuth';
import { getAdminCustomizations } from '../customizations/customizationsApi';
import {
  confirmAdminOrderDeposit,
  getAdminOrders,
  reviewAdminOrder
} from './ordersApi';
import {
  buildAdminOrderReviewPayload,
  createOrderReviewForm,
  type ReviewFormState
} from './adminOrderHelpers';
import type { AdminCustomization, Order } from '../../shared/types';

export type AdminOrdersTab = 'orders' | 'customizations';

export function useAdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customizations, setCustomizations] = useState<AdminCustomization[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<AdminOrdersTab>('orders');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [status, setStatus] = useState('');
  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || orders[0] || null,
    [orders, selectedOrderId]
  );
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(() => createOrderReviewForm(null));

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
    setReviewForm(createOrderReviewForm(selectedOrder));
  }, [selectedOrder]);

  const updateReviewForm = useCallback((patch: Partial<ReviewFormState>) => {
    setReviewForm((current) => ({ ...current, ...patch }));
  }, []);

  const replaceOrder = useCallback((updatedOrder: Order) => {
    setOrders((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
    setSelectedOrderId(updatedOrder.id);
  }, []);

  const submitReview = useCallback(async () => {
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
      const payload = buildAdminOrderReviewPayload(reviewForm);
      const updatedOrder = await reviewAdminOrder(selectedOrder.id, payload, token);
      replaceOrder(updatedOrder);
      setStatus('Pedido actualizado.');
    } catch (reviewError) {
      setStatus(reviewError instanceof Error ? reviewError.message : 'No se pudo actualizar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, replaceOrder, reviewForm, selectedOrder]);

  const confirmDeposit = useCallback(async () => {
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
  }, [navigate, replaceOrder, selectedOrder]);

  const logout = useCallback(() => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  return {
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
    selectedOrderId,
    setActiveTab,
    setSelectedOrderId,
    status,
    submitReview,
    updateReviewForm
  };
}
