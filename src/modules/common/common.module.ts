import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { entities } from '../../list/entities/entities';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [],
    providers: [CommonService],
    exports: [CommonService],
})
export class CommonModule { }

