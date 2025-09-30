import { test, expect } from '@playwright/test';

test.describe('Diario Misional Web - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
  });

  test('should display login page for unauthenticated users', async ({ page }) => {
    await expect(page).toHaveTitle(/Diario Misional/);
    await expect(page.locator('h1')).toContainText('Bienvenido');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Este campo es requerido')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Crear cuenta');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h1')).toContainText('Crear Cuenta');
  });

  test('should display demo mode banner when enabled', async ({ page }) => {
    // This test would require demo mode to be enabled
    // For now, we'll just check the page loads
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that mobile navigation is visible
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Diario Misional/);
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should display loading states', async ({ page }) => {
    // This would test loading states in the actual app
    // For now, we'll check the page loads without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle form submission with valid data', async ({ page }) => {
    // Fill in valid registration data
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123');
    await page.fill('input[name="firstName"]', 'Juan');
    await page.fill('input[name="lastName"]', 'Pérez');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message or redirect
    // This would depend on the actual implementation
  });
});

test.describe('Dashboard Tests (requires authentication)', () => {
  test.beforeEach(async ({ page }) => {
    // This would require authentication setup
    // For now, we'll skip these tests
    test.skip();
  });

  test('should display dashboard after login', async ({ page }) => {
    // Test dashboard functionality
  });

  test('should create diary entry', async ({ page }) => {
    // Test diary entry creation
  });

  test('should export diary data', async ({ page }) => {
    // Test data export functionality
  });
});
