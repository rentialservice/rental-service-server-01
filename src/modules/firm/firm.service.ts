import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firm } from './entities/firm.entity';
import { getUpdateObjectByAction } from '../../common/action-update';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class FirmService {
    constructor(
        @InjectRepository(Firm) private readonly firmRepository: Repository<Firm>,
    ) { }

    async create(createObject: Partial<Firm>): Promise<any> {
        const result = this.firmRepository.create(createObject);
        return await this.firmRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.firmRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["subscription"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const firm = await this.firmRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["subscription"],
        });
        if (!firm) {
            throw new NotFoundException(`Firm with ID ${id} not found`);
        }
        return firm;
    }

    async update(id: string, updateObject: Partial<Firm>, filterType?: string): Promise<any> {
        return await this.firmRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.firmRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.firmRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Firm with ID ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.firmRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}