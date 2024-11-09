import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrefixService } from './prefix.service';
import { PrefixController } from './prefix.controller';
import { Prefix } from './entities/prefix.entity';
import { FirmModule } from '../firm/firm.module';
import { ModuleModule } from '../module/module.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prefix]), FirmModule, ModuleModule],
  providers: [PrefixService],
  controllers: [PrefixController],
  exports: [PrefixService]
})
export class PrefixModule { }
