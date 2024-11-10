import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firm } from './entities/firm.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { SubscriptionService } from '../subscription/subscription.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class FirmService {
    constructor(
        @InjectRepository(Firm) private readonly firmRepository: Repository<Firm>,
        private readonly subscriptionService: SubscriptionService,
        private readonly categoryService: CategoryService
    ) { }

    async create(createObject: Partial<Firm>): Promise<any> {
        if (createObject?.category?.length) {
            let category = await this.categoryService.filter({ id: createObject.category })
            if (!category?.length) {
                throw new NotFoundException(`Categories with id ${createObject.category} not found`)
            }
            createObject.category = category;
        }
        const result = this.firmRepository.create(createObject);
        return await this.firmRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.firmRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["subscription", "category"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const firm = await this.firmRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["subscription", "category"],
        });
        if (!firm) {
            throw new NotFoundException(`Firm with id ${id} not found`);
        }
        return firm;
    }

    async updateSubscription(id: string, updateObject: Partial<Firm>, filterType?: string): Promise<any> {
        if (!updateObject?.subscription) {
            throw new NotFoundException(`Subscription Id not found`);
        }
        if (updateObject?.subscription) {
            let [subscription] = await this.subscriptionService.filter({ name: updateObject.subscription })
            if (!subscription) {
                throw new NotFoundException(`Subscription with name ${updateObject.subscription} not found`)
            }
            updateObject.subscription = subscription;
        }
        return await this.firmRepository.update(id, updateObject);
    }
    async update(id: string, updateObject: Partial<Firm>, filterType?: string): Promise<any> {
        if (updateObject?.subscription) {
            throw new Error(`You are not allowed to modify subscription details, contact your administrator`)
        }
        if (updateObject?.category?.length) {
            let category = await this.categoryService.filter({ id: updateObject.category })
            if (!category?.length) {
                throw new NotFoundException(`Categories with id ${updateObject.category} not found`)
            }
            const firm = await this.firmRepository.findOne({ where: { id }, relations: ['category'] });
            if (!firm) {
                throw new NotFoundException(`Firm with id ${id} not found`);
            }
            firm.category = category;
            return await this.firmRepository.save(firm);
        } else {
            return await this.firmRepository.update(id, updateObject);
        }
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.firmRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Firm with id ${id} not found`);
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