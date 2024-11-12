import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmService } from './firm.service';
import { FirmController } from './firm.controller';
import { Firm } from './entities/firm.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Firm]), CommonModule],
  providers: [FirmService],
  controllers: [FirmController],
  exports: [FirmService],
})
export class FirmModule { }
