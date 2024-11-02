import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { getUpdateObjectByAction } from '../../common/action-update';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class RentalService {
    constructor(
        @InjectRepository(Rental) private readonly rentalRepository: Repository<Rental>,
    ) { }

    async create(createObject: Partial<Rental>): Promise<any> {
        const result = this.rentalRepository.create(createObject);
        return await this.rentalRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.rentalRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const rental = await this.rentalRepository.findOne({ where: { id, deleteFlag: false } });
        if (!rental) {
            throw new NotFoundException(`Rental with ID ${id} not found`);
        }
        return rental;
    }

    async update(id: string, updateObject: Partial<Rental>, filterType?: string): Promise<any> {
        return await this.rentalRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.rentalRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.rentalRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Rental with ID ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.rentalRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}