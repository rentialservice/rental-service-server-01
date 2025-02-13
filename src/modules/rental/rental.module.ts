import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Rental } from './entities/rental.entity';
import { CommonModule } from '../common/common.module';
import { RentalProductModule } from '../rental-products/rental-product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    CommonModule,
    RentalProductModule,
  ],
  providers: [RentalService],
  controllers: [RentalController],
  exports: [RentalService],
})
export class RentalModule {}
