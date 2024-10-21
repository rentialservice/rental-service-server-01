import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getUpdateObjectByAction } from '../../common/action-update';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    ) { }

    async create(createObject: Partial<Product>): Promise<any> {
        const result = this.productRepository.create(createObject);
        return await this.productRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.productRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const product = await this.productRepository.findOne({ where: { id, deleteFlag: false } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateObject: Partial<Product>, filterType?: string): Promise<any> {
        return await this.productRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.productRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return result;
    }
}