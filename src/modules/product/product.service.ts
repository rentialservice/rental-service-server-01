import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CustomFieldsData } from '../custom-fields/entities/custom-fields-data.entity';
import { CustomFields } from '../custom-fields/entities/custom-fields.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';
import { S3Service } from '../supporting-modules/s3/s3.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    @InjectRepository(CustomFieldsData)
    private readonly customFieldsDataRepository: Repository<CustomFieldsData>,
    private readonly commonService: CommonService,
    private readonly s3Service: S3Service,
  ) {}

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

  async create(
    createObject: Partial<Product>,
    queryData: any,
    media?: any[],
  ): Promise<any> {
    if (media?.length) {
      createObject.media = [];
      await Promise.all(
        media.map(async (m) => {
          let fileURL = await this.s3Service.uploadImageS3(
            m,
            process.env.PRODUCT_MEDIA_FOLDER_NAME as string,
          );
          createObject.media.push(fileURL);
        }),
      );
    }
    if (!queryData?.category && !queryData?.firm) {
      throw new Error('Category and Firm is required');
    }
    if (!queryData?.category) {
      throw new Error('Category is required');
    }
    if (!queryData?.firm) {
      throw new Error('Firm is required');
    }
    let [category] = await this.commonService.categoryFilter({
      id: queryData.category,
    });
    if (!category) {
      throw new NotFoundException(
        `Category with id ${queryData.category} not found`,
      );
    } else {
      createObject.category = category;
    }
    let [firm] = await this.commonService.firmFilter({
      id: queryData.firm,
    });
    if (!firm) {
      throw new NotFoundException(`Firm with id ${queryData.firm} not found`);
    } else {
      createObject.firm = firm;
    }
    createObject.customFieldsData =
      (await this.customFieldsValidationAndCreation(createObject)) || [];

    if (!createObject?.code) {
      const lastProduct = await this.productRepository.findOne({
        where: {
          code: Like(`PROD%`),
          category: { id: queryData.category },
          firm: { id: queryData.firm },
        },
        order: { code: 'DESC' },
      });

      const lastCode = lastProduct?.code || 'PROD-0';
      const lastNumber = parseInt(lastCode.split('-')[1], 10) || 0;
      const newCode = `PROD-${lastNumber + 1}`;
      createObject.code = newCode;
    }
    const result = this.productRepository.create(createObject);
    return await this.productRepository.save(result);
  }

  private async customFieldsValidationAndCreation(createObject: any) {
    if (createObject?.customFieldsData?.length) {
      return await Promise.all(
        createObject.customFieldsData.map(async (fieldData: any) => {
          let customField = await this.customFieldsRepository.findOne({
            where: { id: fieldData.customField },
          });
          if (!customField) {
            throw new NotFoundException(
              `Custom field with id ${fieldData.customField} not found`,
            );
          }
          let customFieldsData = this.customFieldsDataRepository.create({
            customField,
            value: fieldData.value,
          });
          return customFieldsData;
        }),
      );
    }
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
    filterCriteria?: any,
  ): Promise<any> {
    if (!filterCriteria?.firm) {
      throw new Error('Firm is required');
    }
    return await this.productRepository.findAndCount({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: ['customFieldsData.customField'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['customFieldsData.customField', 'category', 'firm'],
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateObject: any,
    media: any,
    filterType?: string,
  ): Promise<any> {
    if (media?.length) {
      updateObject.media = [];
      await Promise.all(
        media.map(async (m) => {
          let fileURL = await this.s3Service.uploadImageS3(
            m,
            process.env.PRODUCT_MEDIA_FOLDER_NAME as string,
          );
          updateObject.media.push(fileURL);
        }),
      );
    }
    return await this.productRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    filterCriteria = buildFilterCriteriaQuery(filterCriteria);
    if (Object.values(filterCriteria).length) {
      return await this.productRepository.find({
        where: { ...filterCriteria, deleteFlag: false },
        relations: [...fields],
      });
    } else {
      return [];
    }
  }
}
