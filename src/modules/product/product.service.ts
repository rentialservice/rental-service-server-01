import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';
import { CategoryService } from '../category/category.service';
import { FirmService } from '../firm/firm.service';
import { buildFilterCriteriaQuery } from '../../common/utils';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(CustomFields) private readonly customFieldsRepository: Repository<CustomFields>,
        @InjectRepository(CustomFieldsData) private readonly customFieldsDataRepository: Repository<CustomFieldsData>,
        private readonly categoryService: CategoryService,
        private readonly firmService: FirmService
    ) { }

    // private readonly dataSource: DataSource
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.startTransaction();
    // try {
    //     const product = this.productRepository.create(createObject,request.query);
    //     const savedProduct = await queryRunner.manager.save(product);
    //     await queryRunner.commitTransaction();
    //     return savedProduct;
    // } catch (error) {
    //     await queryRunner.rollbackTransaction();
    //     throw new Error(`Failed to create product: ${error.message}`);
    // } finally {
    //     await queryRunner.release();
    // }

    async create(createObject: Partial<Product>, queryData: any): Promise<any> {
        if (!queryData?.category && !queryData?.firm) {
            throw new Error("Category and Firm is required")
        }
        if (!queryData?.category) {
            throw new Error("Category is required")
        }
        if (!queryData?.firm) {
            throw new Error("Firm is required")
        }
        if (queryData?.category) {
            let [category] = await this.categoryService.filter({
                id: createObject.category
            });
            if (!category) {
                throw new NotFoundException(`Category with id ${createObject.category} not found`);
            } else {
                createObject.category = category;
            }
        }
        if (queryData?.firm) {
            let [firm] = await this.firmService.filter({
                id: createObject.firm
            });
            if (!firm) {
                throw new NotFoundException(`Firm with id ${createObject.firm} not found`);
            } else {
                createObject.firm = firm;
            }
        }
        createObject.customFieldsData = await this.customFieldsValidationAndCreation(createObject) || [];
        const result = this.productRepository.create(createObject);
        return await this.productRepository.save(result);
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

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string, filterCriteria?: any): Promise<any> {
        if (!filterCriteria?.firm) {
            throw new Error("Firm is required")
        }
        return await this.productRepository.findAndCount({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false, },
            relations: ["customFieldsData.customField"],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const product = await this.productRepository.findOne({
            where: { id, deleteFlag: false },
            relations: ["customFieldsData.customField", "category", "firm"],
        });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateObject: any, filterType?: string): Promise<any> {
        return await this.productRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        filterCriteria = buildFilterCriteriaQuery(filterCriteria);
        if (Object.values(filterCriteria).length) {
            return await this.productRepository.find({
                where: { ...filterCriteria, deleteFlag: false },
                relations: [...fields]
            });
        } else {
            return [];
        }
    }
}