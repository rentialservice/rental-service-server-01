import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalProduct } from './entities/rental-product.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';

@Injectable()
export class RentalProductService {
    constructor(
        @InjectRepository(RentalProduct) private readonly rentalProductRepository: Repository<RentalProduct>,
        private readonly commonService: CommonService,
    ) { }

    async create(createObjects: Partial<RentalProduct[]>): Promise<any> {
        await Promise.all(createObjects.map(async (createObject: any) => {
            let [product] = await this.commonService.productFilter({ id: createObject.product })
            if (!product) {
                throw new NotFoundException(`Product with id ${createObject.product} not found`);
            } else {
                createObject.product = product;
            }
        }))
        const result = this.rentalProductRepository.create(createObjects);
        return await this.rentalProductRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.rentalProductRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const rentalProduct = await this.rentalProductRepository.findOne({
            where: { id, deleteFlag: false },
        });
        if (!rentalProduct) {
            throw new NotFoundException(`RentalProduct with id ${id} not found`);
        }
        return rentalProduct;
    }

    async update(id: string, updateObject: Partial<RentalProduct>, filterType?: string): Promise<any> {
        return await this.rentalProductRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.rentalProductRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`RentalProduct with id ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.rentalProductRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}