import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';
import { CategoryModule } from '../category/category.module';
import { FirmModule } from '../firm/firm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, CustomFieldsData, CustomFields]), CategoryModule, FirmModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule { }
