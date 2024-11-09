import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModeService } from './payment-mode.service';
import { PaymentModeController } from './payment-mode.controller';
import { PaymentMode } from './entities/payment-mode.entity';
import { FirmModule } from '../firm/firm.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMode]), FirmModule],
  providers: [PaymentModeService],
  controllers: [PaymentModeController],
  exports: [PaymentModeService]
})
export class PaymentModeModule { }
