import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUpdateObjectByAction } from '../../common/action-update';
import { Schema } from './entities/schema.entity';

@Injectable()
export class SchemaService {
    constructor(
        @InjectRepository(Schema) private readonly  schemaRepository: Repository<Schema>,
    ) { }

    async create(createObject: Partial<Schema>): Promise<any> {
        const result = this.schemaRepository.create(createObject);
        return await this.schemaRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
       return await this.schemaRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const result = await this.schemaRepository.findOne({ where: { id, deleteFlag: false } });
        if (!result) {
            throw new NotFoundException(`Schema Feilds with ID ${id} not found`);
        }
        return result;
    }

    async update(id: string, updateObject: Partial<Schema>, filterType?: string): Promise<any> {
        return await this.schemaRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.schemaRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.schemaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Schema Fields with ID ${id} not found`);
        }
        return result;
    }
}
