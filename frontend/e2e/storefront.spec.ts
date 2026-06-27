import { expect, test } from '@playwright/test';

test.describe('Storefront', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tuft-atelier-language', 'es');
    });
  });

  test('loads the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: /Ir al inicio/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Navegación principal/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Alfombras únicas/i })).toBeVisible();
  });

  test('navigates to the catalog page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^Catálogo$/i }).click();

    await expect(page).toHaveURL(/\/catalogo$/);
    await expect(page.getByRole('heading', { name: /^Catálogo$/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Ver diseño y presupuesto/i }).first()
    ).toBeVisible();
  });

  test('loads the personalization page directly', async ({ page }) => {
    await page.goto('/personalizar');

    await expect(page).toHaveURL(/\/personalizar$/);
    await expect(
      page.getByRole('heading', { name: /Crea tu alfombra personalizada/i })
    ).toBeVisible();
  });

  test('opens the customization form from the personalization page', async ({ page }) => {
    await page.goto('/personalizar');
    await page.getByRole('button', { name: /Crea tu alfombra personalizada/i }).click();

    await expect(
      page.getByRole('heading', { name: /Crea tu alfombra personalizada/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Siguiente/i })).toBeVisible();
  });

  test('opens the AI guide from the personalization page', async ({ page }) => {
    await page.goto('/personalizar');
    await page.getByRole('button', { name: /Referencia con IA/i }).click();

    await expect(
      page.getByRole('dialog', { name: /Crea tu idea antes de completar el pedido/i })
    ).toBeVisible();
    await expect(page.getByLabel(/Prompt listo para copiar/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Copiar prompt/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Enviar referencia y pedir presupuesto/i })
    ).toHaveAttribute('href', /wa\.me/);
  });

  test('loads an existing product detail route directly', async ({ page }) => {
    await page.goto('/producto/bola-ocho');

    await expect(page).toHaveURL(/\/producto\/bola-ocho$/);
    await expect(page.getByRole('heading', { name: /Bola Ocho/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Solicitar presupuesto por WhatsApp', exact: true })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver alfombras disponibles/i })).toBeVisible();
  });

  test('switches the storefront language between ES and PT', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Cambiar idioma a portugués/i }).click();

    await expect(page.getByText(/Tapetes sob encomenda/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /^Criar tapete$/i })).toBeVisible();

    await page.getByRole('button', { name: /Mudar idioma para espanhol/i }).click();

    await expect(page.getByText(/Rugs made to order/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /^Crear alfombra$/i })).toBeVisible();
  });

  test('renders the internal not found page for unknown routes', async ({ page }) => {
    await page.goto('/ruta-inexistente');

    await expect(page).toHaveURL(/\/ruta-inexistente$/);
    await expect(page.getByRole('heading', { name: /No encontramos esta página/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver alfombras disponibles/i })).toBeVisible();
  });
});

test.describe('Storefront public SEO resources', () => {
  test('serves robots.txt with a sitemap reference', async ({ page }) => {
    const response = await page.goto('/robots.txt');

    expect(response?.ok()).toBe(true);
    const body = await response!.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap:');
    expect(body).toContain('https://tufting-rugs-store.vercel.app/sitemap.xml');
  });

  test('serves sitemap.xml with public storefront routes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');

    expect(response?.ok()).toBe(true);
    const body = await response!.text();
    expect(body).toContain('https://tufting-rugs-store.vercel.app/catalogo');
    expect(body).toContain('/producto/bola-ocho');
  });

  test('serves llms.txt for AI assistant guidance', async ({ page }) => {
    const response = await page.goto('/llms.txt');

    expect(response?.ok()).toBe(true);
    const body = await response!.text();
    expect(body).toContain('Tuft Atelier');
    expect(body).toContain('WhatsApp oficial');
  });
});
