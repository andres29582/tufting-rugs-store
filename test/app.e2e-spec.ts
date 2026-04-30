import '../src/config/load-env';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp, seedAppData } from '../src/app.setup';
import { AppModule } from '../src/app.module';
import { OrderStatus } from '../src/orders/order-domain';
import { PrismaService } from '../src/prisma/prisma.service';
import { FULL_CUSTOM_ANCHOR_SLUG } from '../src/products/products-seed.service';

describe('Backend HTTP flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let fullCustomProductId: string;
  let adminToken: string;

  const testRunId = Date.now();
  const customerEmail = `e2e-${testRunId}@example.com`;

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
    }

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

    const loginResponse = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        email: 'admin@rugs.local',
        password: 'admin123'
      })
      .expect(201);

    adminToken = loginResponse.body.accessToken;
    expect(adminToken).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .get('/customizations')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
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
});
