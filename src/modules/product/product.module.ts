import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, CustomFieldsData, CustomFields])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule { }
