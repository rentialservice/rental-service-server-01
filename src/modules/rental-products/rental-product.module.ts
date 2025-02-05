import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalProductService } from './rental-product.service';
import { RentalProductController } from './rental-product.controller';
import { RentalProduct } from './entities/rental-product.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([RentalProduct]), CommonModule],
  providers: [RentalProductService],
  controllers: [RentalProductController],
  exports: [RentalProductService],
})
export class RentalProductModule { }
