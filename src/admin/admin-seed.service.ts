import { Inject, Injectable } from '@nestjs/common';
import { APP_CONFIG } from '../config/app-config.provider';
import type { AppConfig } from '../config/app-config';
import { PrismaService } from '../prisma/prisma.service';
import { AdminRole } from './admin-domain';
import { AdminPasswordService } from './admin-password.service';

@Injectable()
export class AdminSeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: AdminPasswordService,
    @Inject(APP_CONFIG) private readonly config: AppConfig
  ) {}

  async seedConfiguredAdminIfNeeded(): Promise<void> {
    const email = this.config.adminEmail.trim().toLowerCase();
    const existingAdmin = await this.prisma.adminUser.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingAdmin) {
      return;
    }

    await this.prisma.adminUser.create({
      data: {
        email,
        passwordHash: this.passwords.hash(this.config.adminPassword),
        role: AdminRole.ADMIN,
        isActive: true
      }
    });
  }
}
