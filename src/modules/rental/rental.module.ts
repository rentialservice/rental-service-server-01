import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Rental } from './entities/rental.entity';
import { ProductModule } from '../product/product.module';
import { BuyerModule } from '../users/buyer/buyer.module';

@Module({
    imports: [TypeOrmModule.forFeature([Rental]), ProductModule, BuyerModule],
    providers: [RentalService],
    controllers: [RentalController],
    exports: [RentalService],
})
export class RentalModule { }
