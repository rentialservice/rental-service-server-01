import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from '../../users/buyer/entities/buyer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
