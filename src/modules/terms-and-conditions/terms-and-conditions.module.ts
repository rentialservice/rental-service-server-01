import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermsAndConditionsService } from "./terms-and-conditions.service";
import { TermsAndConditionsController } from "./terms-and-conditions.controller";
import { TermsAndConditions } from "./entities/terms-and-conditions.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([TermsAndConditions]), CommonModule],
  providers: [TermsAndConditionsService],
  controllers: [TermsAndConditionsController],
  exports: [TermsAndConditionsService],
})
export class TermsAndConditionsModule {}
