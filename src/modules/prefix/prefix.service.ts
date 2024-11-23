import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prefix } from './entities/prefix.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';
import { ModuleNameList } from '../../enums/module.enum';

@Injectable()
export class PrefixService {
    constructor(
        @InjectRepository(Prefix) private readonly prefixRepository: Repository<Prefix>,
        private readonly commonService: CommonService,
    ) { }

    async create(createObject: Partial<Prefix>, queryData: any): Promise<any> {
        if (!createObject?.module && !queryData?.firm) {
            throw new Error("Module & Frim is required")
        }
        if (!createObject?.module) {
            throw new Error("Module is required")
        }
        if (!queryData?.firm) {
            throw new Error("Firm is required")
        }
        if (createObject?.module === ModuleNameList.Product && !queryData?.category) {
            throw new Error("Category is also required for adding any prefix for Product module")
        }
        let [firm] = await this.commonService.firmFilter({
            id: queryData.firm
        });
        if (!firm) {
            throw new NotFoundException(`Firm with id ${queryData.firm} not found`);
        } else {
            createObject.firm = firm;
        }
        if (createObject?.module === ModuleNameList.Product && queryData?.category) {
            let [category] = await this.commonService.categoryFilter({
                id: queryData.category
            });
            if (!category) {
                throw new NotFoundException(`Category with id ${queryData.category} not found`);
            } else {
                createObject.category = category;
            }
        }
        const result = this.prefixRepository.create(createObject);
        return await this.prefixRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.prefixRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const prefix = await this.prefixRepository.findOne({ where: { id, deleteFlag: false } });
        if (!prefix) {
            throw new NotFoundException(`Prefix with id ${id} not found`);
        }
        return prefix;
    }

    async update(id: string, updateObject: Partial<Prefix>, filterType?: string): Promise<any> {
        return await this.prefixRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.prefixRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Prefix with id ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.prefixRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}