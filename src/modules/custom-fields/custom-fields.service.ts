import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUpdateObjectByAction } from '../../common/action-update';
import { CustomFields } from './entities/custom-fields.entity';
import { ModuleService } from '../module/module.service';

@Injectable()
export class CustomFieldsService {
    constructor(
        @InjectRepository(CustomFields) private readonly customFieldsRepository: Repository<CustomFields>,
        private readonly moduleService: ModuleService
    ) { }

    async create(createObject: any): Promise<any> {
        if (!createObject?.modules?.length) {
            throw new Error("At least one module is required to create any custom fields")
        }
        createObject.modules = await this.moduleService.filter({ id: createObject.modules })
        const result = this.customFieldsRepository.create(createObject);
        return await this.customFieldsRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.customFieldsRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["modules"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const result = await this.customFieldsRepository.findOne({ where: { id, deleteFlag: false }, relations: ["modules"] });
        if (!result) {
            throw new NotFoundException(`Custom Feilds with ID ${id} not found`);
        }
        return result;
    }

    async update(id: string, updateObject: any, filterType?: string): Promise<any> {
        if (updateObject?.modules?.length) {
            updateObject.modules = await this.moduleService.filter({ id: updateObject.modules })
        }
        return await this.customFieldsRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.customFieldsRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.customFieldsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Custom Fields with ID ${id} not found`);
        }
        return result;
    }
}
