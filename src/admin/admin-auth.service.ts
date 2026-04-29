import {
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import type { PrismaService } from '../prisma/prisma.service';
import { APP_CONFIG } from '../config/app-config.provider';
import type { AppConfig } from '../config/app-config';
import { AdminRole } from './admin-domain';
import { AdminPasswordService } from './admin-password.service';
import type {
  AdminJwtPayload,
  AdminLoginInput,
  AdminLoginResult
} from './admin-auth.types';

type AdminUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
};

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: AdminPasswordService,
    @Inject(APP_CONFIG) private readonly config: AppConfig
  ) {}

  async login(input: AdminLoginInput): Promise<AdminLoginResult> {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true
      }
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    const typedAdmin = admin as AdminUserRecord;

    if (!this.passwords.verify(password, typedAdmin.passwordHash)) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    return {
      accessToken: this.signAdminToken(typedAdmin),
      admin: {
        id: typedAdmin.id,
        email: typedAdmin.email,
        role: typedAdmin.role
      }
    };
  }

  verifyToken(token: string): AdminJwtPayload {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid admin token.');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, this.config.jwtSecret);

    if (!safeEqual(signature, expectedSignature)) {
      throw new UnauthorizedException('Invalid admin token.');
    }

    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AdminJwtPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp <= now) {
      throw new UnauthorizedException('Admin token expired.');
    }

    if (payload.role !== AdminRole.ADMIN) {
      throw new UnauthorizedException('Admin token is not authorized.');
    }

    return payload;
  }

  private signAdminToken(admin: Pick<AdminUserRecord, 'id' | 'email' | 'role'>): string {
    const now = Math.floor(Date.now() / 1000);
    const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = toBase64Url(
      JSON.stringify({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
        iat: now,
        exp: now + TOKEN_TTL_SECONDS
      })
    );
    const unsignedToken = `${header}.${payload}`;
    return `${unsignedToken}.${sign(unsignedToken, this.config.jwtSecret)}`;
  }
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

function toBase64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}
