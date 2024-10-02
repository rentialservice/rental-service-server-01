import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotificationModule } from '../../supporting-modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    NotificationModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
