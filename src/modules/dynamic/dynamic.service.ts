import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicSchema } from './entities/dynamic-schema.entity';
import { DynamicData } from './entities/dynamic-data.entity';

@Injectable()
export class DynamicService {
    constructor(
        @InjectRepository(DynamicSchema)
        private dynamicSchemaRepository: Repository<DynamicSchema>,
        @InjectRepository(DynamicData)
        private dynamicDataRepository: Repository<DynamicData>,
    ) { }

    async createSchema(entityName: string, schemaDefinition: object): Promise<DynamicSchema> {
        const schema =
         this.dynamicSchemaRepository.create({ entityName, schemaDefinition });
        return this.dynamicSchemaRepository.save(schema);
    }

    async storeData(id: string, data: object): Promise<DynamicData> {
        const schema = await this.dynamicSchemaRepository.findOne({ where: { id } });
        if (!schema) throw new Error('Schema not found');
        const dynamicData = this.dynamicDataRepository.create({ schema, data });
        return this.dynamicDataRepository.save(dynamicData);
    }

    async getData(schemaId: string): Promise<DynamicData[]> {
        return this.dynamicDataRepository.find({ where: { schema: { id: schemaId } } });
    }


    async updateSchema(schemaId: string, updateSchemaDto: { entityName?: string; schemaDefinition?: object }): Promise<DynamicSchema> {
        const schema = await this.dynamicSchemaRepository.findOne({ where: { id: schemaId } });
        if (!schema) throw new NotFoundException('Schema not found');
        if (updateSchemaDto.entityName) {
            schema.entityName = updateSchemaDto.entityName;
        }
        if (updateSchemaDto.schemaDefinition) {
            schema.schemaDefinition = updateSchemaDto.schemaDefinition;
        }
        return this.dynamicSchemaRepository.save(schema);
    }

    async updateData(dataId: string, data: object): Promise<DynamicData> {
        const dynamicData = await this.dynamicDataRepository.findOne({ where: { id: dataId } });
        if (!dynamicData) throw new NotFoundException('Data not found');
        dynamicData.data = data;
        return this.dynamicDataRepository.save(dynamicData);
    }

    async deleteSchema(schemaId: string): Promise<void> {
        const result = await this.dynamicSchemaRepository.delete({ id: schemaId });
        if (result.affected === 0) {
            throw new NotFoundException('Schema not found');
        }
    }

    async deleteData(dataId: string): Promise<void> {
        const result = await this.dynamicDataRepository.delete({ id: dataId });
        if (result.affected === 0) {
            throw new NotFoundException('Data not found');
        }
    }
}
