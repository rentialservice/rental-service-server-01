import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Rental } from './entities/rental.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Rental])],
    providers: [RentalService],
    controllers: [RentalController],
    exports: [RentalService],
})
export class RentalModule { }
