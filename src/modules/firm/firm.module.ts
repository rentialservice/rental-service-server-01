import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmService } from './firm.service';
import { FirmController } from './firm.controller';
import { Firm } from './entities/firm.entity';
import { SubscriptionModule } from '../subscription/subscription.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Firm]), SubscriptionModule, CategoryModule],
  providers: [FirmService],
  controllers: [FirmController],
  exports: [FirmService],
})
export class FirmModule { }
