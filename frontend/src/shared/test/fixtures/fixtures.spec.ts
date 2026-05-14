import { describe, expect, it } from 'vitest';
import {
  adminProductCreatePayloadFixture,
  adminProductEditPayloadFixture,
  customizableProductFixture,
  orderReviewPayloadFixture,
  pendingCustomizationFixture,
  pendingOrderFixture,
  publishedProductFixture,
  reviewedApprovedOrderFixture,
  unpublishedProductFixture
} from './index';

describe('test data fixtures', () => {
  it('provides the main product states', () => {
    expect(publishedProductFixture.isActive).toBe(true);
    expect(unpublishedProductFixture.isActive).toBe(false);
    expect(customizableProductFixture.type).toBe('FULL_CUSTOM');
    expect(customizableProductFixture.isCustomizable).toBe(true);
  });

  it('provides a pending customization linked to the customizable product', () => {
    expect(pendingCustomizationFixture.productId).toBe(customizableProductFixture.id);
    expect(pendingCustomizationFixture.customerEmail).toBe('cliente@example.com');
    expect(pendingCustomizationFixture.designReferences).toHaveLength(1);
  });

  it('provides pending and reviewed order states', () => {
    expect(pendingOrderFixture.status).toBe('WAITING_ANALYSIS');
    expect(pendingOrderFixture.adminReviews).toHaveLength(0);
    expect(reviewedApprovedOrderFixture.status).toBe('APPROVED');
    expect(reviewedApprovedOrderFixture.adminReviews[0]?.status).toBe('APPROVED');
  });

  it('provides admin product and review payload fixtures', () => {
    expect(adminProductCreatePayloadFixture.type).toBe('READY_MADE');
    expect(adminProductEditPayloadFixture.name).toBe('Alfombra admin editada');
    expect(orderReviewPayloadFixture.status).toBe('WAITING_CUSTOMER_APPROVAL');
  });
});
