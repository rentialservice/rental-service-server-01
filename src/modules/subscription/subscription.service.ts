import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { getUpdateObjectByAction } from '../../common/action-update';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription) private readonly firmRepository: Repository<Subscription>,
    ) { }

    async create(createObject: Partial<Subscription>): Promise<any> {
        const result = this.firmRepository.create(createObject);
        return await this.firmRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.firmRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const firm = await this.firmRepository.findOne({ where: { id, deleteFlag: false } });
        if (!firm) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }
        return firm;
    }

    async update(id: string, updateObject: Partial<Subscription>, filterType?: string): Promise<any> {
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
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }
        return result;
    }
}