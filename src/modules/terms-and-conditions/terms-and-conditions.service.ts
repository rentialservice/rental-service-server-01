import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsAndConditions } from './entities/terms-and-conditions.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';

@Injectable()
export class TermsAndConditionsService {
    constructor(
        @InjectRepository(TermsAndConditions) private readonly termsAndConditionsRepository: Repository<TermsAndConditions>,
        private readonly commonService: CommonService,
    ) { }

    async create(createObject: Partial<TermsAndConditions>, queryData: any): Promise<any> {
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
        const result = this.termsAndConditionsRepository.create(createObject);
        return await this.termsAndConditionsRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.termsAndConditionsRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const termsAndConditions = await this.termsAndConditionsRepository.findOne({
            where: { id, deleteFlag: false },
        });
        if (!termsAndConditions) {
            throw new NotFoundException(`TermsAndConditions with id ${id} not found`);
        }
        return termsAndConditions;
    }

    async update(id: string, updateObject: Partial<TermsAndConditions>, filterType?: string): Promise<any> {
        return await this.termsAndConditionsRepository.update(id, updateObject);
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.termsAndConditionsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`TermsAndConditions with id ${id} not found`);
        }
        return result;
    }

    async filter(filterCriteria: any, fields: string[] = [], filterType?: string): Promise<any> {
        return await this.termsAndConditionsRepository.find({
            where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
            relations: [...fields]
        });
    }
}