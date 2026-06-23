import { expect, test } from '@playwright/test';

test.describe('Storefront', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tuft-atelier-language', 'es');
    });
  });

  test('loads the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Ir al inicio/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Navegación principal/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Alfombras únicas/i })).toBeVisible();
  });

  test('navigates to the catalog page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^Catálogo$/i }).click();

    await expect(page).toHaveURL(/#\/catalogo$/);
    await expect(page.getByRole('heading', { name: /^Catálogo$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver detalles/i }).first()).toBeVisible();
  });

  test('opens the customization form from the personalization page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^Personalizadas$/i }).click();

    await expect(page).toHaveURL(/#\/personalizar$/);
    await expect(
      page.getByRole('heading', { name: /Personaliza tu tapete a tu manera/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Personaliza tu tapete a tu manera/i }).click();

    await expect(
      page.getByRole('heading', { name: /Crea tu alfombra personalizada/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Siguiente/i })).toBeVisible();
  });
});
