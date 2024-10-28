import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmService } from './firm.service';
import { FirmController } from './firm.controller';
import { Firm } from './entities/firm.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([Firm]), SubscriptionModule],
  providers: [FirmService],
  controllers: [FirmController],
  exports: [FirmService],
})
export class FirmModule { }
