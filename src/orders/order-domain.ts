import { BadRequestException, ConflictException } from '@nestjs/common';
export { ProductType } from '../domain/domain-enums';

export enum OrderStatus {
  WAITING_ANALYSIS = 'WAITING_ANALYSIS',
  IN_ANALYSIS = 'IN_ANALYSIS',
  WAITING_CUSTOMER_APPROVAL = 'WAITING_CUSTOMER_APPROVAL',
  APPROVED = 'APPROVED',
  WAITING_DEPOSIT = 'WAITING_DEPOSIT',
  DEPOSIT_CONFIRMED = 'DEPOSIT_CONFIRMED',
  DESIGN_APPROVED = 'DESIGN_APPROVED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export type OrderForStatusRules = {
  id: string;
  status: OrderStatus;
  depositPaid: boolean;
  productionPossible: boolean;
};

export const DEPOSIT_PERCENTAGE = 0.5;

export const STATUS_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  [OrderStatus.WAITING_ANALYSIS]: [
    OrderStatus.IN_ANALYSIS,
    OrderStatus.CANCELED
  ],
  [OrderStatus.IN_ANALYSIS]: [
    OrderStatus.WAITING_CUSTOMER_APPROVAL,
    OrderStatus.CANCELED
  ],
  [OrderStatus.WAITING_CUSTOMER_APPROVAL]: [
    OrderStatus.IN_ANALYSIS,
    OrderStatus.APPROVED,
    OrderStatus.CANCELED
  ],
  [OrderStatus.APPROVED]: [
    OrderStatus.IN_ANALYSIS,
    OrderStatus.WAITING_DEPOSIT,
    OrderStatus.CANCELED
  ],
  [OrderStatus.WAITING_DEPOSIT]: [
    OrderStatus.IN_ANALYSIS,
    OrderStatus.DEPOSIT_CONFIRMED,
    OrderStatus.CANCELED
  ],
  [OrderStatus.DEPOSIT_CONFIRMED]: [OrderStatus.DESIGN_APPROVED],
  [OrderStatus.DESIGN_APPROVED]: [OrderStatus.IN_PRODUCTION],
  [OrderStatus.IN_PRODUCTION]: [OrderStatus.READY_FOR_DELIVERY],
  [OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELED]: []
};

const BLOCKED_WHEN_PRODUCTION_IS_NOT_POSSIBLE = new Set<OrderStatus>([
  OrderStatus.WAITING_CUSTOMER_APPROVAL,
  OrderStatus.APPROVED,
  OrderStatus.WAITING_DEPOSIT,
  OrderStatus.DEPOSIT_CONFIRMED,
  OrderStatus.DESIGN_APPROVED,
  OrderStatus.IN_PRODUCTION
]);

export function calculateDepositAmountCents(priceCents: number | null | undefined): number | null {
  if (priceCents === null || priceCents === undefined) {
    return null;
  }

  assertValidMoneyCents(priceCents, 'priceCents');
  return Math.round(priceCents * DEPOSIT_PERCENTAGE);
}

export function assertValidMoneyCents(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new BadRequestException(`${fieldName} must be a non-negative integer in cents.`);
  }
}

export function assertDepositStateIsConsistent(order: Pick<OrderForStatusRules, 'status' | 'depositPaid'>): void {
  if (order.status === OrderStatus.DEPOSIT_CONFIRMED && !order.depositPaid) {
    throw new ConflictException('Order is inconsistent: DEPOSIT_CONFIRMED requires depositPaid = true.');
  }
}

export function assertCanUpdateStatus(order: OrderForStatusRules, nextStatus: OrderStatus): void {
  assertDepositStateIsConsistent(order);

  if (nextStatus === OrderStatus.DEPOSIT_CONFIRMED) {
    throw new BadRequestException('DEPOSIT_CONFIRMED can only be reached through confirm-deposit.');
  }

  assertCanTransition(order, nextStatus);
}

export function assertCanTransition(order: OrderForStatusRules, nextStatus: OrderStatus): void {
  if (order.status === OrderStatus.CANCELED) {
    throw new BadRequestException('CANCELED is a final status.');
  }

  if (order.status === OrderStatus.DELIVERED) {
    throw new BadRequestException('DELIVERED is a final status.');
  }

  if (
    !order.productionPossible &&
    BLOCKED_WHEN_PRODUCTION_IS_NOT_POSSIBLE.has(nextStatus)
  ) {
    throw new BadRequestException(
      'Order cannot advance while productionPossible is false.'
    );
  }

  const allowedNextStatuses = STATUS_TRANSITIONS[order.status];

  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new BadRequestException(
      `Invalid order status transition from ${order.status} to ${nextStatus}.`
    );
  }
}
