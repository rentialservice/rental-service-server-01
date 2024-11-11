import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prefix } from './entities/prefix.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { FirmService } from '../firm/firm.service';

@Injectable()
export class PrefixService {
    constructor(
        @InjectRepository(Prefix) private readonly prefixRepository: Repository<Prefix>,
        private readonly firmService: FirmService,
    ) { }

    async create(createObject: Partial<Prefix>): Promise<any> {
        if (!createObject?.module && !createObject?.firm) {
            throw new Error("Module and Frim is required")
        }
        if (!createObject?.module) {
            throw new Error("Module is required")
        }
        if (!createObject?.firm) {
            throw new Error("Firm is required")
        }
        if (createObject?.firm) {
            let [firm] = await this.firmService.filter({
                id: createObject.firm
            });
            if (!firm) {
                throw new NotFoundException(`Firm with id ${createObject.firm} not found`);
            } else {
                createObject.firm = firm;
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