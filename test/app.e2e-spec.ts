import '../src/config/load-env';
import { type INestApplication } from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp, seedAppData } from '../src/app.setup';
import { AppModule } from '../src/app.module';
import { OrderStatus } from '../src/orders/order-domain';
import { PrismaService } from '../src/prisma/prisma.service';
import { FULL_CUSTOM_ANCHOR_SLUG } from '../src/products/products-seed.service';
import { PRODUCT_IMAGE_UPLOAD_DIR } from '../src/uploads/upload-paths';

describe('Backend HTTP flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let fullCustomProductId: string;

  const testRunId = Date.now();
  const customerEmail = `e2e-${testRunId}@example.com`;
  const productSlugPrefix = `e2e-product-${testRunId}`;
  const uploadedProductImages: string[] = [];
  const validPngImage = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = configureApp(moduleRef.createNestApplication());
    await app.init();
    await seedAppData(app);

    prisma = app.get(PrismaService);
    await cleanupE2eData(customerEmail);

    const fullCustomProduct = await prisma.product.findUniqueOrThrow({
      where: { slug: FULL_CUSTOM_ANCHOR_SLUG },
      select: { id: true }
    });
    fullCustomProductId = fullCustomProduct.id;
  });

  afterAll(async () => {
    if (prisma) {
      await cleanupE2eData(customerEmail);
      await cleanupE2eProducts(productSlugPrefix);
    }

    await Promise.all(
      uploadedProductImages.map((filename) =>
        unlink(join(PRODUCT_IMAGE_UPLOAD_DIR, filename)).catch(() => undefined)
      )
    );

    if (app) {
      await app.close();
    }
  });

  it('loads the public FULL_CUSTOM anchor product', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: fullCustomProductId,
          slug: FULL_CUSTOM_ANCHOR_SLUG,
          type: 'FULL_CUSTOM'
        })
      ])
    );
  });

  it('rejects invalid customization DTOs before service logic', async () => {
    await request(app.getHttpServer())
      .post('/customizations')
      .send({
        productId: fullCustomProductId,
        customerName: 'Ana',
        customerEmail: 'not-an-email',
        unexpectedField: true
      })
      .expect(400);
  });

  it('creates customization and then creates exactly one order from it', async () => {
    const customizationResponse = await request(app.getHttpServer())
      .post('/customizations')
      .send({
        productId: fullCustomProductId,
        customerName: 'Ana E2E',
        customerEmail,
        customerPhone: '555',
        description: 'Logo rug for e2e',
        preferredColors: ['red', 'blue', 'RED'],
        designReferences: [
          {
            url: 'https://example.com/reference.png',
            originalName: 'reference.png'
          }
        ]
      })
      .expect(201);

    expect(customizationResponse.body).toEqual(
      expect.objectContaining({
        productId: fullCustomProductId,
        customerEmail,
        preferredColors: ['red', 'blue']
      })
    );
    expect(customizationResponse.body.designReferences).toHaveLength(1);

    const customizationId = customizationResponse.body.id as string;

    const orderResponse = await request(app.getHttpServer())
      .post(`/customizations/${customizationId}/order`)
      .send({
        estimatedPriceCents: 22000,
        notes: 'E2E order'
      })
      .expect(201);

    expect(orderResponse.body).toEqual(
      expect.objectContaining({
        productId: fullCustomProductId,
        customizationId,
        customerEmail,
        publicCode: expect.stringMatching(/^RUG-\d{8}-[A-Z0-9]{4}$/),
        status: OrderStatus.WAITING_ANALYSIS,
        depositAmountCents: 11000,
        depositPaid: false
      })
    );

    await request(app.getHttpServer())
      .post(`/customizations/${customizationId}/order`)
      .send({
        estimatedPriceCents: 22000
      })
      .expect(409);
  });

  it('blocks direct FULL_CUSTOM orders without customization', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .send({
        customerName: 'Ana E2E',
        customerEmail: `direct-${customerEmail}`,
        productId: fullCustomProductId
      })
      .expect(400);
  });

  it('protects admin endpoints and accepts admin login token', async () => {
    await request(app.getHttpServer()).get('/customizations').expect(401);

    const adminToken = await loginAdmin();
    expect(adminToken).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .get('/customizations')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('lets an admin upload a product image', async () => {
    const adminToken = await loginAdmin();

    await request(app.getHttpServer())
      .post('/admin/uploads/product-images')
      .attach('file', validPngImage, {
        filename: 'test-rug.png',
        contentType: 'image/png'
      })
      .expect(401);

    const uploadResponse = await request(app.getHttpServer())
      .post('/admin/uploads/product-images')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', validPngImage, {
        filename: 'test-rug.png',
        contentType: 'image/png'
      })
      .expect(201);

    expect(uploadResponse.body).toEqual(
      expect.objectContaining({
        url: expect.stringMatching(/^\/uploads\/product-images\/.+\.png$/),
        storageKey: expect.stringMatching(/^product-images\/.+\.png$/),
        originalName: 'test-rug.png',
        mimeType: 'image/png'
      })
    );

    const filename = String(uploadResponse.body.url).split('/').pop();

    if (filename) {
      uploadedProductImages.push(filename);
    }

    await request(app.getHttpServer())
      .get(uploadResponse.body.url)
      .expect(200);
  });

  it('lets an admin create, publish and unpublish a product', async () => {
    const adminToken = await loginAdmin();
    const slug = `${productSlugPrefix}-catalog`;

    await cleanupE2eProducts(productSlugPrefix);

    const createResponse = await request(app.getHttpServer())
      .post('/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'E2E Catalog Rug',
        slug,
        description: 'Created from e2e admin flow.',
        type: 'READY_MADE',
        basePriceCents: 18000,
        sizeCategory: 'MEDIUM',
        sizeLabel: '80 x 60 cm',
        format: 'RECTANGULAR',
        category: 'Decorativas',
        imageUrl: '/uploads/product-images/e2e-rug.png',
        colors: ['black', 'blue'],
        features: ['Hecha a mano'],
        material: 'Lana acrilica',
        productionTime: '12 a 18 dias',
        isCustomizable: true,
        isFeatured: true,
        isActive: false
      })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        slug,
        isActive: false,
        imageUrl: '/uploads/product-images/e2e-rug.png'
      })
    );

    await request(app.getHttpServer())
      .get(`/products/slug/${slug}`)
      .expect(404);

    const publishResponse = await request(app.getHttpServer())
      .patch(`/admin/products/${createResponse.body.id}/publish`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(publishResponse.body).toEqual(
      expect.objectContaining({
        slug,
        isActive: true
      })
    );

    await request(app.getHttpServer())
      .get(`/products/slug/${slug}`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/admin/products/${createResponse.body.id}/unpublish`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/products/slug/${slug}`)
      .expect(404);
  });

  it('lets an admin review an order and stores AdminReview history', async () => {
    const adminToken = await loginAdmin();
    const customizationResponse = await request(app.getHttpServer())
      .post('/customizations')
      .send({
        productId: fullCustomProductId,
        customerName: 'Review E2E',
        customerEmail,
        preferredColors: ['black', 'white']
      })
      .expect(201);

    const orderResponse = await request(app.getHttpServer())
      .post(`/customizations/${customizationResponse.body.id}/order`)
      .send({
        estimatedPriceCents: 22000
      })
      .expect(201);
    const orderId = orderResponse.body.id as string;

    const firstReviewResponse = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: OrderStatus.IN_ANALYSIS,
        estimatedPriceCents: 24000,
        comment: 'Admin started production analysis.'
      })
      .expect(200);

    expect(firstReviewResponse.body).toEqual(
      expect.objectContaining({
        id: orderId,
        status: OrderStatus.IN_ANALYSIS,
        estimatedPriceCents: 24000,
        depositAmountCents: 12000
      })
    );
    expect(firstReviewResponse.body.adminReviews[0]).toEqual(
      expect.objectContaining({
        status: OrderStatus.IN_ANALYSIS,
        estimatedPriceCents: 24000,
        depositAmountCents: 12000,
        comment: 'Admin started production analysis.'
      })
    );

    const secondReviewResponse = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
        finalPriceCents: 31001,
        productionPossible: true,
        comment: 'Final quote ready for customer approval.'
      })
      .expect(200);

    expect(secondReviewResponse.body).toEqual(
      expect.objectContaining({
        id: orderId,
        status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
        finalPriceCents: 31001,
        depositAmountCents: 15501,
        productionPossible: true
      })
    );
    expect(secondReviewResponse.body.adminReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: OrderStatus.WAITING_CUSTOMER_APPROVAL,
          productionPossible: true,
          estimatedPriceCents: 24000,
          finalPriceCents: 31001,
          depositAmountCents: 15501,
          comment: 'Final quote ready for customer approval.'
        }),
        expect.objectContaining({
          status: OrderStatus.IN_ANALYSIS,
          estimatedPriceCents: 24000,
          depositAmountCents: 12000
        })
      ])
    );

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: OrderStatus.DEPOSIT_CONFIRMED,
        comment: 'Should use confirm-deposit instead.'
      })
      .expect(400);
  });

  async function cleanupE2eData(email: string): Promise<void> {
    await prisma.order.deleteMany({
      where: {
        OR: [
          { customerEmail: email },
          { customerEmail: `direct-${email}` }
        ]
      }
    });
    await prisma.customization.deleteMany({
      where: { customerEmail: email }
    });
  }

  async function cleanupE2eProducts(slugPrefix: string): Promise<void> {
    await prisma.product.deleteMany({
      where: {
        slug: {
          startsWith: slugPrefix
        }
      }
    });
  }

  async function loginAdmin(): Promise<string> {
    const loginResponse = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        email: 'admin@rugs.local',
        password: 'admin123'
      })
      .expect(201);

    return loginResponse.body.accessToken as string;
  }
});
