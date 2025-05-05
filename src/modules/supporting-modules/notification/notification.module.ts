import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationToken } from "./entities/notification-token.entity";
import { Notification } from "./entities/notification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationToken, Notification])],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
