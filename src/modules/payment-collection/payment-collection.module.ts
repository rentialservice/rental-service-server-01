import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentCollectionService } from './payment-collection.service';
import { PaymentCollectionController } from './payment-collection.controller';
import { PaymentCollection } from './entities/payment-collection.entity';
import { CommonModule } from '../common/common.module';
import { RentalModule } from '../rental/rental.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentCollection]),
    CommonModule,
    RentalModule,
  ],
  providers: [PaymentCollectionService],
  controllers: [PaymentCollectionController],
  exports: [PaymentCollectionService],
})
export class PaymentCollectionModule {}
