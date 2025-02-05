import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { CustomFields } from './entities/custom-fields.entity';
import { FirmModule } from '../firm/firm.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomFields]), FirmModule],
  providers: [CustomFieldsService],
  controllers: [CustomFieldsController],
})
export class CustomFieldsModule { }
