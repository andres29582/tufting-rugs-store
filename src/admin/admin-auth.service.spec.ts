import { UnauthorizedException } from '@nestjs/common';
import type { AppConfig } from '../config/app-config';
import { AdminRole } from './admin-domain';
import { AdminAuthService } from './admin-auth.service';
import { AdminPasswordService } from './admin-password.service';
import { AdminSeedService } from './admin-seed.service';

const config: AppConfig = {
  nodeEnv: 'test',
  databaseUrl: 'postgresql://postgres:postgres@localhost:5432/rugs',
  jwtSecret: 'test-secret-with-more-than-thirty-two-characters',
  adminEmail: 'Admin@Rugs.Local',
  adminPassword: 'admin123',
  port: 3001
};

type MockPrisma = {
  adminUser: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

function createMockPrisma(): MockPrisma {
  return {
    adminUser: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  };
}

describe('AdminAuthService', () => {
  it('logs in with valid credentials and verifies the issued token', async () => {
    const prisma = createMockPrisma();
    const passwords = new AdminPasswordService();
    const service = new AdminAuthService(prisma as never, passwords, config);
    const passwordHash = passwords.hash('admin123');

    prisma.adminUser.findUnique.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@rugs.local',
      passwordHash,
      role: AdminRole.ADMIN,
      isActive: true
    });

    const result = await service.login({
      email: 'admin@rugs.local',
      password: 'admin123'
    });

    expect(result.admin.email).toBe('admin@rugs.local');
    expect(service.verifyToken(result.accessToken).sub).toBe('admin-1');
  });

  it('rejects invalid credentials', async () => {
    const prisma = createMockPrisma();
    const passwords = new AdminPasswordService();
    const service = new AdminAuthService(prisma as never, passwords, config);

    prisma.adminUser.findUnique.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@rugs.local',
      passwordHash: passwords.hash('admin123'),
      role: AdminRole.ADMIN,
      isActive: true
    });

    await expect(
      service.login({
        email: 'admin@rugs.local',
        password: 'wrong'
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

describe('AdminSeedService', () => {
  it('creates configured admin when missing', async () => {
    const prisma = createMockPrisma();
    const passwords = new AdminPasswordService();
    const seed = new AdminSeedService(prisma as never, passwords, config);

    prisma.adminUser.findUnique.mockResolvedValue(null);
    prisma.adminUser.create.mockResolvedValue({ id: 'admin-1' });

    await seed.seedConfiguredAdminIfNeeded();

    expect(prisma.adminUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'admin@rugs.local',
        role: AdminRole.ADMIN,
        isActive: true
      })
    });
  });

  it('does not overwrite an existing admin', async () => {
    const prisma = createMockPrisma();
    const passwords = new AdminPasswordService();
    const seed = new AdminSeedService(prisma as never, passwords, config);

    prisma.adminUser.findUnique.mockResolvedValue({ id: 'admin-1' });

    await seed.seedConfiguredAdminIfNeeded();

    expect(prisma.adminUser.create).not.toHaveBeenCalled();
  });
});
