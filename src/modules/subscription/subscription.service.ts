import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { getUpdateObjectByAction } from '../../common/action-update';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { FirmService } from '../firm/firm.service';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,
        private readonly firmService: FirmService,
    ) { }

    async create(createObject: Partial<Subscription>): Promise<any> {
        const result = this.subscriptionRepository.create(createObject);
        return await this.subscriptionRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.subscriptionRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["firm"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["firm"],
        });
        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }
        return subscription;
    }

    async update(id: string, updateObject: Partial<Subscription>, filterType?: string): Promise<any> {
        return await this.subscriptionRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.subscriptionRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.subscriptionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.subscriptionRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}