import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getUpdateObjectByAction } from '../../common/action-update';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';
import { CategoryService } from '../category/category.service';
import { FirmService } from '../firm/firm.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(CustomFields) private readonly customFieldsRepository: Repository<CustomFields>,
        @InjectRepository(CustomFieldsData) private readonly customFieldsDataRepository: Repository<CustomFieldsData>,
        private readonly categoryService: CategoryService,
        private readonly firmService: FirmService,
        private readonly dataSource: DataSource
    ) { }

    async create(createObject: any): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            let [category] = await this.categoryService.filter({
                id: createObject.category
            });
            if (!category) {
                throw new NotFoundException(`Category with id ${createObject.category} not found`);
            }
            createObject.category = category;
            let [firm] = await this.firmService.filter({
                id: createObject.firm
            });
            if (!firm) {
                throw new NotFoundException(`Firm with id ${createObject.firm} not found`);
            }
            createObject.firm = firm;
            createObject.customFieldsData = await this.customFieldsValidationAndCreation(createObject);
            const product = this.productRepository.create(createObject);
            const savedProduct = await queryRunner.manager.save(product);
            await queryRunner.commitTransaction();
            return savedProduct;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create product: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    private async customFieldsValidationAndCreation(createObject: any) {
        if (createObject?.customFieldsData?.length) {
            return await Promise.all(
                createObject.customFieldsData.map(async (fieldData: any) => {
                    let customField = await this.customFieldsRepository.findOne({
                        where: { id: fieldData.customField }
                    });
                    if (!customField) {
                        throw new NotFoundException(`Custom field with id ${fieldData.customField} not found`);
                    }
                    let customFieldsData = this.customFieldsDataRepository.create({
                        customField,
                        value: fieldData.value,
                    });
                    return customFieldsData;
                })
            );
        }
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.productRepository.findAndCount({
            where: { deleteFlag: false },
            relations: ["customFieldsData.customField", "category"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const product = await this.productRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["customFieldsData.customField", "category"],
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateObject: any, filterType?: string): Promise<any> {
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