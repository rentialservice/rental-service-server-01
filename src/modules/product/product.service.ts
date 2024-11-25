import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';
import { PrefixService } from '../prefix/prefix.service';
import { ModuleNameList } from '../../enums/module.enum';
import { S3Service } from '../supporting-modules/s3/s3.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(CustomFields) private readonly customFieldsRepository: Repository<CustomFields>,
        @InjectRepository(CustomFieldsData) private readonly customFieldsDataRepository: Repository<CustomFieldsData>,
        private readonly commonService: CommonService,
        private readonly prefixService: PrefixService,
        private readonly s3Service: S3Service,
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

    async create(createObject: Partial<Product>, queryData: any, media?: any[]): Promise<any> {
        if (media) {
            createObject.media = [];
            await Promise.all(
                media.map(async (m) => {
                    let fileURL = await this.s3Service.uploadImageS3(m, process.env.PRODUCT_MEDIA_FOLDER_NAME as string);
                    createObject.media.push(fileURL);
                }),
            );
        }
        if (!queryData?.category && !queryData?.firm) {
            throw new Error("Category and Firm is required")
        }
        if (!queryData?.category) {
            throw new Error("Category is required")
        }
        if (!queryData?.firm) {
            throw new Error("Firm is required")
        }
        let [category] = await this.commonService.categoryFilter({
            id: queryData.category
        });
        if (!category) {
            throw new NotFoundException(`Category with id ${queryData.category} not found`);
        } else {
            createObject.category = category;
        }
        if (createObject?.category?.isAutoIncrementForProductCode) {
            let [prefix]: any = await this.prefixService.filter({
                firm: queryData?.firm, category: queryData?.category, module: ModuleNameList.Product
            }, ["firm", "category"]);
            if (!prefix) {
                throw new NotFoundException("Prefix not found")
            }
            createObject.code = prefix?.name + "-" + prefix?.nextNumber;
            if (prefix) {
                await this.prefixService.update(prefix.id, { nextNumber: prefix?.nextNumber + 1 })
            }
        } else {
            // let [existing] = await this.filter({
            //     firm: queryData.firm, code: createObject?.code
            // }, ["firm"]);
            // if (existing) {
            //     throw new Error("Data already exists for this firm")
            // }
        }
        let [firm] = await this.commonService.firmFilter({
            id: queryData.firm
        });
        if (!firm) {
            throw new NotFoundException(`Firm with id ${queryData.firm} not found`);
        } else {
            createObject.firm = firm;
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