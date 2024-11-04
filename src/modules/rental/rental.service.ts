import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { ProductService } from '../product/product.service';
import { BuyerService } from '../users/buyer/buyer.service';

@Injectable()
export class RentalService {
    constructor(
        @InjectRepository(Rental) private readonly rentalRepository: Repository<Rental>,
        private readonly productService: ProductService,
        private readonly buyerService: BuyerService,

    ) { }

    async create(createObject: Partial<Rental>): Promise<any> {
        if (!createObject?.product && !createObject?.buyer) {
            throw new Error("Product and Buyer is required")
        }
        if (!createObject?.product) {
            throw new Error("Product is required")
        }
        if (!createObject?.buyer) {
            throw new Error("Buyer is required")
        }
        if (createObject?.product) {
            let [product] = await this.productService.filter({ id: createObject.product })
            if (!product) {
                throw new NotFoundException(`Product with id ${createObject.product} not found`);
            } else {
                createObject.product = product;
            }
        }
        if (createObject?.buyer) {
            let [buyer] = await this.buyerService.filter({ id: createObject.buyer })
            if (!buyer) {
                throw new NotFoundException(`Buyer with id ${createObject.buyer} not found`);
            } else {
                createObject.buyer = buyer;
            }
        }
        const result = this.rentalRepository.create(createObject);
        return await this.rentalRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.rentalRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["buyer", "product"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const rental = await this.rentalRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["buyer", "product"],
        });
        if (!rental) {
            throw new NotFoundException(`Rental with ID ${id} not found`);
        }
        return rental;
    }

    async update(id: string, updateObject: Partial<Rental>, filterType?: string): Promise<any> {
        return await this.rentalRepository.update(id, updateObject);
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