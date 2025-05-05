import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirmService } from "./firm.service";
import { FirmController } from "./firm.controller";
import { Firm } from "./entities/firm.entity";
import { CommonModule } from "../common/common.module";
import { PaymentModeModule } from "../payment-mode/payment-mode.module";
import { S3Module } from "../supporting-modules/s3/s3.module";
import { PrefixModule } from "../prefix/prefix.module";
import { TermsAndConditionsModule } from "../terms-and-conditions/terms-and-conditions.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Firm]),
    CommonModule,
    PaymentModeModule,
    S3Module,
    PrefixModule,
    TermsAndConditionsModule,
  ],
  providers: [FirmService],
  controllers: [FirmController],
  exports: [FirmService],
})
export class FirmModule {}
