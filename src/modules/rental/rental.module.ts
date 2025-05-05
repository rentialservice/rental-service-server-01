import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RentalService } from "./rental.service";
import { RentalController } from "./rental.controller";
import { Rental } from "./entities/rental.entity";
import { CommonModule } from "../common/common.module";
import { RentalProductModule } from "../rental-products/rental-product.module";
import { PrefixModule } from "../prefix/prefix.module";
import { RentalProduct } from "../rental-products/entities/rental-product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental, RentalProduct]),
    CommonModule,
    RentalProductModule,
    PrefixModule,
  ],
  providers: [RentalService],
  controllers: [RentalController],
  exports: [RentalService],
})
export class RentalModule {}
