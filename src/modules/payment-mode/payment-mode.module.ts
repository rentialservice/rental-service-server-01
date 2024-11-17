import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModeService } from './payment-mode.service';
import { PaymentModeController } from './payment-mode.controller';
import { PaymentMode } from './entities/payment-mode.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMode]), CommonModule],
  providers: [PaymentModeService],
  controllers: [PaymentModeController],
  exports: [PaymentModeService]
})
export class PaymentModeModule { }
