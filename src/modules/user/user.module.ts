import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotificationModule } from '../supporting-modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NotificationModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
