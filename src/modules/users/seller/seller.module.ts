import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationModule } from "../../supporting-modules/notification/notification.module";
import { Seller } from "./entities/seller.entity";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { RoleModule } from "../../role/role.module";

@Module({
  imports: [TypeOrmModule.forFeature([Seller]), NotificationModule, RoleModule],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
