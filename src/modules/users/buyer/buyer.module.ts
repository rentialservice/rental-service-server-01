import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../../supporting-modules/notification/notification.module';
import { Buyer } from './entities/buyer.entity';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { RoleModule } from '../../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Buyer]),
    NotificationModule,
    RoleModule
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
