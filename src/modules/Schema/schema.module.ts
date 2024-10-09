import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schema } from './entities/schema.entity';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schema])],
  providers: [SchemaService],
  controllers: [SchemaController],
})
export class SchemaModule {}
