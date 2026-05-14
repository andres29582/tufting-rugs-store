import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [AdminModule],
  controllers: [UploadsController]
})
export class UploadsModule {}
