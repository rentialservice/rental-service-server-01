import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Installment } from './entities/installment.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class InstallmentService {
    constructor(
        @InjectRepository(Installment) private readonly installmentRepository: Repository<Installment>,
    ) { }

    async create(createObject: Partial<Installment>): Promise<any> {
        const result = this.installmentRepository.create(createObject);
        return await this.installmentRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.installmentRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const installment = await this.installmentRepository.findOne({ where: { id, deleteFlag: false } });
        if (!installment) {
            throw new NotFoundException(`Installment with ID ${id} not found`);
        }
        return installment;
    }

    async update(id: string, updateObject: Partial<Installment>, filterType?: string): Promise<any> {
        return await this.installmentRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.installmentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Installment with ID ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.installmentRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}