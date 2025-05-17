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
import { Subscription } from "../subscription/entities/subscription.entity";
import { SubscriptionDetails } from "../subscription/entities/subscription-details.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Firm, Subscription, SubscriptionDetails]),
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
