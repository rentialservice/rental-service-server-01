import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PaymentCollection } from './entities/payment-collection.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';
import { RentalService } from '../rental/rental.service';

@Injectable()
export class PaymentCollectionService {
  constructor(
    @InjectRepository(PaymentCollection)
    private readonly paymentCollectionRepository: Repository<PaymentCollection>,
    private readonly commonService: CommonService,
    private readonly rentalService: RentalService,
  ) {}

  async create(
    createObject: Partial<PaymentCollection>,
    queryData: any,
  ): Promise<any> {
    if (!createObject?.paymentMode) {
      throw new Error('Payment Mode is required');
    }
    if (!createObject?.rental) {
      throw new Error('Rental is required');
    }
    if (!queryData?.firm) {
      throw new Error('Firm is required');
    }
    let [firm] = await this.commonService.firmFilter({
      id: queryData.firm,
    });
    if (!firm) {
      throw new NotFoundException(`Firm with id ${queryData.firm} not found`);
    } else {
      createObject.firm = firm;
    }
    let [paymentMode] = await this.commonService.paymentModeFilter({
      id: createObject.paymentMode,
    });
    if (!paymentMode) {
      throw new NotFoundException(
        `Payment Mode with id ${createObject.paymentMode} not found`,
      );
    } else {
      createObject.paymentMode = paymentMode;
    }
    let [rental] = await this.commonService.rentalFilter({
      id: createObject.rental,
    });
    if (!rental) {
      throw new NotFoundException(
        `Rental with id ${createObject.rental} not found`,
      );
    } else if (rental?.pendingAmount < createObject?.amount) {
      throw new NotFoundException(
        `Receipt Amount cannot be greater than Rental pending amount`,
      );
    } else {
      createObject.rental = rental;
    }
    const result = this.paymentCollectionRepository.create(createObject);
    let response = await this.paymentCollectionRepository.save(result);
    if (response) {
      let updateObj = {
        pendingAmount:
          parseFloat(rental?.pendingAmount) - (createObject?.amount || 0),
        paidAmount:
          parseFloat(rental?.paidAmount) + (createObject?.amount || 0),
        invoiceStatus:
          parseFloat(rental?.pendingAmount) === createObject?.amount
            ? 'Paid'
            : rental?.invoiceStatus,
      };
      await this.rentalService.update(rental?.id, updateObj);
    }
    return response;
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
  ): Promise<any> {
    return await this.paymentCollectionRepository.findAndCount({
      where: { deleteFlag: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const paymentCollection = await this.paymentCollectionRepository.findOne({
      where: { id, deleteFlag: false },
    });
    if (!paymentCollection) {
      throw new NotFoundException(`PaymentCollection with id ${id} not found`);
    }
    return paymentCollection;
  }

  async update(
    id: string,
    updateObject: Partial<PaymentCollection>,
    filterType?: string,
  ): Promise<any> {
    return await this.paymentCollectionRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.paymentCollectionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PaymentCollection with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.paymentCollectionRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async getAmountStatistics(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: any,
  ): Promise<any> {
    if (!filterCriteria?.firm) {
      throw new Error('Firm is required');
    }
    filterCriteria = buildFilterCriteriaQuery(filterCriteria);
    let today = new Date();
    const startOfDay = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    const startOfMonth = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
    );
    let dailyPayments = await this.paymentCollectionRepository.find({
      where: {
        ...filterCriteria,
        createdAt: MoreThanOrEqual(startOfDay),
        deleteFlag: false,
      },
      relations: [...fields],
    });
    let monthlyPayments = await this.paymentCollectionRepository.find({
      where: {
        ...filterCriteria,
        createdAt: MoreThanOrEqual(startOfMonth),
        deleteFlag: false,
      },
      relations: [...fields],
    });
    let dailyTotal = dailyPayments.reduce(
      (sum: any, payment: any) => sum + parseFloat(payment.amount),
      0,
    );
    let monthlyTotal = monthlyPayments.reduce(
      (sum: any, payment: any) => sum + parseFloat(payment.amount),
      0,
    );
    return { dailyTotal, monthlyTotal };
  }
}
