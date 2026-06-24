import type { AdminProductPayload } from '../../types';
import { buildAdminProductPayload, buildOrderReviewPayload } from '../builders';

export const adminProductCreatePayloadFixture = buildAdminProductPayload();

export const adminProductEditPayloadFixture: Partial<AdminProductPayload> =
  buildAdminProductPayload({
    name: 'Alfombra admin editada',
    slug: 'alfombra-admin-editada',
    basePriceCents: 17500,
    isFeatured: true,
  });

export const orderReviewPayloadFixture = buildOrderReviewPayload();
