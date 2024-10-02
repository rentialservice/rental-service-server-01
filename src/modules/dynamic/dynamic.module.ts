import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicService } from './dynamic.service';
import { DynamicController } from './dynamic.controller';
import { DynamicSchema } from './entities/dynamic-schema.entity';
import { DynamicData } from './entities/dynamic-data.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DynamicSchema, DynamicData]),
    ],
    controllers: [DynamicController],
    providers: [DynamicService],
    exports: [DynamicService],
})
export class DynamicModule { }

