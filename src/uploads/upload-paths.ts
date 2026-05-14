import { join } from 'node:path';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
export const PRODUCT_IMAGE_UPLOAD_DIR = join(UPLOADS_ROOT, 'product-images');
export const PUBLIC_PRODUCT_IMAGE_PATH = '/uploads/product-images';

export function isSafeProductImageFilename(filename: string): boolean {
  return /^[a-z0-9-]+\.(gif|jpe?g|png|webp)$/i.test(filename);
}
