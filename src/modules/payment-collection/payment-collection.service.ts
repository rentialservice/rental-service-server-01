import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentCollection } from './entities/payment-collection.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class PaymentCollectionService {
    constructor(
        @InjectRepository(PaymentCollection) private readonly paymentCollectionRepository: Repository<PaymentCollection>,
    ) { }

    async create(createObject: Partial<PaymentCollection>): Promise<any> {
        const result = this.paymentCollectionRepository.create(createObject);
        return await this.paymentCollectionRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.paymentCollectionRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const paymentCollection = await this.paymentCollectionRepository.findOne({ where: { id, deleteFlag: false } });
        if (!paymentCollection) {
            throw new NotFoundException(`PaymentCollection with id ${id} not found`);
        }
        return paymentCollection;
    }

    async update(id: string, updateObject: Partial<PaymentCollection>, filterType?: string): Promise<any> {
        return await this.paymentCollectionRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.paymentCollectionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`PaymentCollection with id ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.paymentCollectionRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}