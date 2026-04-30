import { OrderStatus } from './order-domain';

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  productId?: string | null;
  customizationId?: string | null;
  estimatedPriceCents?: number | null;
  finalPriceCents?: number | null;
  notes?: string | null;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

export type UpdateFinalPriceInput = {
  finalPriceCents: number;
};

export type ReviewOrderInput = {
  productionPossible?: boolean;
  estimatedPriceCents?: number | null;
  finalPriceCents?: number | null;
  status?: OrderStatus;
  comment?: string | null;
};

export type ConfirmDepositResult = {
  id: string;
  status: OrderStatus;
  depositPaid: boolean;
};
