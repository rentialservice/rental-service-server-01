import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RentalProductService } from "./rental-product.service";
import { RentalProductController } from "./rental-product.controller";
import { RentalProduct } from "./entities/rental-product.entity";
import { CommonModule } from "../common/common.module";
import { Product } from "../product/entities/product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RentalProduct, Product]), CommonModule],
  providers: [RentalProductService],
  controllers: [RentalProductController],
  exports: [RentalProductService],
})
export class RentalProductModule {}
