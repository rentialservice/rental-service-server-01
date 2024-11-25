import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';
import { CommonModule } from '../common/common.module';
import { PrefixModule } from '../prefix/prefix.module';
import { S3Module } from '../supporting-modules/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, CustomFieldsData, CustomFields]), CommonModule, PrefixModule, S3Module],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
