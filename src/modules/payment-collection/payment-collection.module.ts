import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentCollectionService } from './payment-collection.service';
import { PaymentCollectionController } from './payment-collection.controller';
import { PaymentCollection } from './entities/payment-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentCollection])],
  providers: [PaymentCollectionService],
  controllers: [PaymentCollectionController],
  exports: [PaymentCollectionService]
})
export class PaymentCollectionModule { }
