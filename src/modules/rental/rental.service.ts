import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';

@Injectable()
export class RentalService {
    constructor(
        @InjectRepository(Rental) private readonly rentalRepository: Repository<Rental>,
        private readonly commonService: CommonService

    ) { }

    async create(createObject: Partial<Rental>, queryData: any): Promise<any> {
        if (!createObject?.product) {
            throw new Error("Product is required")
        }
        if (!createObject?.buyer) {
            throw new Error("Buyer is required")
        }
        if (!createObject?.paymentMode) {
            throw new Error("Payment Mode is required")
        }
        if (!queryData?.firm) {
            throw new Error("Firm is required")
        }

        let [firm] = await this.commonService.firmFilter({
            id: queryData.firm
        });
        if (!firm) {
            throw new NotFoundException(`Firm with id ${queryData.firm} not found`);
        } else {
            createObject.firm = firm;
        }
        let [product] = await this.commonService.productFilter({ id: createObject.product })
        if (!product) {
            throw new NotFoundException(`Product with id ${createObject.product} not found`);
        } else {
            createObject.product = product;
        }
        let [buyer] = await this.commonService.buyerFilter({ id: createObject.buyer })
        if (!buyer) {
            throw new NotFoundException(`Buyer with id ${createObject.buyer} not found`);
        } else {
            createObject.buyer = buyer;
        }
        let [paymentMode] = await this.commonService.paymentModeFilter({ id: createObject.paymentMode })
        if (!paymentMode) {
            throw new NotFoundException(`Payment Mode with id ${createObject.paymentMode} not found`);
        } else {
            createObject.paymentMode = paymentMode;
        }
        const result = this.rentalRepository.create(createObject);
        return await this.rentalRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.rentalRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["buyer", "product", "paymentCollection"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const rental = await this.rentalRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["buyer", "product", "paymentCollection"],
        });
        if (!rental) {
            throw new NotFoundException(`Rental with id ${id} not found`);
        }
        return rental;
    }

    async update(id: string, updateObject: Partial<Rental>, filterType?: string): Promise<any> {
        return await this.rentalRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.rentalRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Rental with id ${id} not found`);
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