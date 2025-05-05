import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationModule } from "../../supporting-modules/notification/notification.module";
import { Buyer } from "./entities/buyer.entity";
import { BuyerController } from "./buyer.controller";
import { BuyerService } from "./buyer.service";
import { CommonModule } from "../../common/common.module";
import { S3Module } from "../../supporting-modules/s3/s3.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Buyer]),
    NotificationModule,
    CommonModule,
    S3Module,
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
