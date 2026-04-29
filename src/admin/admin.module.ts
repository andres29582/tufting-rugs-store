import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminGuard } from './admin.guard';
import { AdminPasswordService } from './admin-password.service';
import { AdminSeedService } from './admin-seed.service';

@Module({
  controllers: [AdminAuthController],
  providers: [
    AdminAuthService,
    AdminGuard,
    AdminPasswordService,
    AdminSeedService
  ],
  exports: [AdminGuard, AdminSeedService]
})
export class AdminModule {}
