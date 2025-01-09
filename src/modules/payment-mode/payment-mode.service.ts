import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMode } from './entities/payment-mode.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';

@Injectable()
export class PaymentModeService {
  constructor(
    @InjectRepository(PaymentMode)
    private readonly paymentModeRepository: Repository<PaymentMode>,
    private readonly commonService: CommonService,
  ) {}

  async create(createObject: any): Promise<any> {
    if (!createObject?.firm) {
      throw new Error('Firm is required');
    }
    if (createObject?.firm) {
      let [firm] = await this.commonService.firmFilter({
        id: createObject.firm,
      });
      if (!firm) {
        throw new NotFoundException(
          `Firm with id ${createObject.firm} not found`,
        );
      } else {
        createObject.firm = firm;
      }
    }
    const result = this.paymentModeRepository.create(createObject);
    return await this.paymentModeRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
  ): Promise<any> {
    return await this.paymentModeRepository.findAndCount({
      where: { deleteFlag: false },
      relations: ['firm'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const paymentMode = await this.paymentModeRepository.findOne({
      where: { id, deleteFlag: false },
    });
    if (!paymentMode) {
      throw new NotFoundException(`PaymentMode with id ${id} not found`);
    }
    return paymentMode;
  }

  async update(
    id: string,
    updateObject: Partial<PaymentMode>,
    filterType?: string,
  ): Promise<any> {
    return await this.paymentModeRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.paymentModeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PaymentMode with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.paymentModeRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }
}
