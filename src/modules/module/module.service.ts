import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module_Table } from './entities/module.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class ModuleService {
    constructor(
        @InjectRepository(Module_Table) private readonly moduleRepository: Repository<Module_Table>,
    ) { }

    async create(createObject: Partial<Module_Table>): Promise<any> {
        const result = this.moduleRepository.create(createObject);
        return await this.moduleRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.moduleRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const module = await this.moduleRepository.findOne({ where: { id, deleteFlag: false } });
        if (!module) {
            throw new NotFoundException(`Module with id ${id} not found`);
        }
        return module;
    }

    async update(id: string, updateObject: Partial<Module_Table>, filterType?: string): Promise<any> {
        return await this.moduleRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.moduleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Module with id ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.moduleRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}