import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { CustomFields } from './entities/custom-fields.entity';
import { ModuleModule } from '../module/module.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomFields]), ModuleModule],
  providers: [CustomFieldsService],
  controllers: [CustomFieldsController],
})
export class CustomFieldsModule { }
