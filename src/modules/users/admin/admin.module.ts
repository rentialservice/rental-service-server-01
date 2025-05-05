import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { NotificationModule } from "../../supporting-modules/notification/notification.module";
import { RoleModule } from "../../role/role.module";

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), NotificationModule, RoleModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
