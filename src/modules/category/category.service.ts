import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUpdateObjectByAction } from '../../common/action-update';
import { Category } from './entities/category.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createObject: Partial<Category>): Promise<any> {
        const result = this.categoryRepository.create(createObject);
        return await this.categoryRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.categoryRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const result = await this.categoryRepository.findOne({ where: { id, deleteFlag: false } });
        if (!result) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return result;
    }

    async update(id: string, updateObejct: Partial<Category>, filterType?: string): Promise<any> {
        return await this.categoryRepository.update(id, updateObejct);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.categoryRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.categoryRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}
