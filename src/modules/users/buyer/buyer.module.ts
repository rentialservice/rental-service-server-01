import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../../supporting-modules/notification/notification.module';
import { Buyer } from './entities/buyer.entity';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Buyer]),
    NotificationModule,
    CommonModule
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule { }
