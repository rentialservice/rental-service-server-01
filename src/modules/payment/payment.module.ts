import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { Payment } from "./entities/payment.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), CommonModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
