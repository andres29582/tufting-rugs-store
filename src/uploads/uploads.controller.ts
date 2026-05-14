import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { access, mkdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';
import { AdminGuard } from '../admin/admin.guard';
import {
  PRODUCT_IMAGE_UPLOAD_DIR,
  PUBLIC_PRODUCT_IMAGE_PATH,
  isSafeProductImageFilename
} from './upload-paths';

type UploadedProductImage = {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
};

type FileResponse = {
  sendFile: (path: string) => void;
};

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp'
]);
const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

async function validateImageContent(buffer: Buffer): Promise<void> {
  const detectedMimeType = detectAllowedImageMimeType(buffer);
  if (!detectedMimeType || !ALLOWED_IMAGE_MIME_TYPES.has(detectedMimeType)) {
    throw new BadRequestException('File content does not match allowed image types.');
  }
}

function detectAllowedImageMimeType(buffer: Buffer): string | null {
  if (hasSignature(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }

  if (hasSignature(buffer, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg';
  }

  if (hasAsciiSignature(buffer, 0, 'GIF87a') || hasAsciiSignature(buffer, 0, 'GIF89a')) {
    return 'image/gif';
  }

  if (hasAsciiSignature(buffer, 0, 'RIFF') && hasAsciiSignature(buffer, 8, 'WEBP')) {
    return 'image/webp';
  }

  return null;
}

function hasSignature(buffer: Buffer, signature: number[]): boolean {
  if (buffer.length < signature.length) {
    return false;
  }

  return signature.every((byte, index) => buffer[index] === byte);
}

function hasAsciiSignature(buffer: Buffer, offset: number, signature: string): boolean {
  if (buffer.length < offset + signature.length) {
    return false;
  }

  return buffer.toString('ascii', offset, offset + signature.length) === signature;
}

const productImageUploadOptions = {
  storage: diskStorage({
    destination: async (
      _request: unknown,
      _file: unknown,
      callback: (error: Error | null, destination: string) => void
    ) => {
      try {
        await mkdir(PRODUCT_IMAGE_UPLOAD_DIR, { recursive: true });
        callback(null, PRODUCT_IMAGE_UPLOAD_DIR);
      } catch (error) {
        callback(error as Error, PRODUCT_IMAGE_UPLOAD_DIR);
      }
    },
    filename: (
      _request: unknown,
      file: unknown,
      callback: (error: Error | null, filename: string) => void
    ) => {
      callback(null, `${Date.now()}-${randomUUID()}${getImageExtension(file as { originalname?: string; mimetype?: string })}`);
    }
  }),
  limits: {
    fileSize: MAX_PRODUCT_IMAGE_SIZE_BYTES
  },
  fileFilter: (
    _request: unknown,
    file: { mimetype?: string },
    callback: (error: Error | null, acceptFile: boolean) => void
  ) => {
    if (!file.mimetype || !ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      callback(new BadRequestException('Only PNG, JPG, WEBP or GIF images are allowed.'), false);
      return;
    }

    callback(null, true);
  }
};

@Controller()
export class UploadsController {
  @Post('admin/uploads/product-images')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file', productImageUploadOptions))
  async uploadProductImage(@UploadedFile() file: UploadedProductImage | undefined) {
    if (!file) {
      throw new BadRequestException('Product image file is required.');
    }

    const filePath = join(PRODUCT_IMAGE_UPLOAD_DIR, file.filename);
    const buffer = await readFile(filePath);
    await validateImageContent(buffer);

    return {
      url: `${PUBLIC_PRODUCT_IMAGE_PATH}/${file.filename}`,
      storageKey: `product-images/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  }

  @Get('uploads/product-images/:filename')
  async serveProductImage(
    @Param('filename') filename: string,
    @Res() response: FileResponse
  ): Promise<void> {
    if (!isSafeProductImageFilename(filename)) {
      throw new NotFoundException('Product image not found.');
    }

    const filePath = join(PRODUCT_IMAGE_UPLOAD_DIR, filename);

    try {
      await access(filePath);
    } catch {
      throw new NotFoundException('Product image not found.');
    }

    response.sendFile(filePath);
  }
}

function getImageExtension(file: { originalname?: string; mimetype?: string }): string {
  switch (file.mimetype) {
    case 'image/gif':
      return '.gif';
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return normalizeExtension(file.originalname);
  }
}

function normalizeExtension(originalName: string | undefined): string {
  const extension = extname(originalName || '').toLowerCase();

  if (extension === '.jpeg') {
    return '.jpg';
  }

  if (extension === '.gif' || extension === '.jpg' || extension === '.png' || extension === '.webp') {
    return extension;
  }

  return '.png';
}
