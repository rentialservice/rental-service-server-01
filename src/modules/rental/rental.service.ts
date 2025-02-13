import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';
import {
  generateHTMLFromTemplate,
  generatePdfFromTemplate,
} from '../../common/common';
import { RentalProductService } from '../rental-products/rental-product.service';
import { InvoiceStatus } from '../../enums/status.enum';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    private readonly commonService: CommonService,
    private readonly rentalProductService: RentalProductService,
  ) {}

  async create(createObject: Partial<Rental>, queryData: any): Promise<any> {
    if (!createObject?.rentalProduct) {
      throw new Error('Products are required');
    }
    if (!createObject?.buyer) {
      throw new Error('Buyer is required');
    }
    if (!createObject?.paymentMode) {
      throw new Error('Payment Mode is required');
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
    let rentalProduct = await this.rentalProductService.create(
      createObject.rentalProduct,
    );
    createObject.rentalProduct = rentalProduct;

    let [buyer] = await this.commonService.buyerFilter({
      id: createObject.buyer,
    });
    if (!buyer) {
      throw new NotFoundException(
        `Buyer with id ${createObject.buyer} not found`,
      );
    } else {
      createObject.buyer = buyer;
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
    createObject.pendingAmount
      ? (createObject.invoiceStatus = InvoiceStatus.PartiallyPaid)
      : (createObject.invoiceStatus = InvoiceStatus.Paid);
    const result = this.rentalRepository.create(createObject);
    return await this.rentalRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
    filterCriteria?: any,
  ): Promise<any> {
    delete filterCriteria.category;
    return await this.rentalRepository.findAndCount({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: ['buyer', 'firm', 'rentalProduct.product'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const rental = await this.rentalRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['buyer', 'rentalProduct.product', 'firm'],
    });
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return rental;
  }

  async createInvoice(id: string, filterType?: string): Promise<any> {
    // const rental = await this.rentalRepository.findOne({
    //   where: { id, deleteFlag: false },
    //   relations: ['buyer', 'product', 'paymentCollection'],
    // });
    // if (!rental) {
    //   throw new NotFoundException(`Rental with id ${id} not found`);
    // }
    const data = {
      invoiceDate: new Date().toLocaleDateString(),
      invoiceNumber: 'INV-12345',
      client: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, Anytown, USA',
      },
      items: [
        {
          description: 'Web Design',
          quantity: 1,
          unitPrice: 500,
          totalAmount: 500,
        },
        {
          description: 'Hosting',
          quantity: 12,
          unitPrice: 10,
          totalAmount: 120,
        },
      ],
      totalAmount: 620,
    };
    return await generatePdfFromTemplate(data, 'invoice');
  }

  async createInvoicePreview(id: string, filterType?: string): Promise<any> {
    // const rental = await this.rentalRepository.findOne({
    //   where: { id, deleteFlag: false },
    //   relations: ['buyer', 'product', 'paymentCollection'],
    // });
    // if (!rental) {
    //   throw new NotFoundException(`Rental with id ${id} not found`);
    // }
    const data = {
      invoiceDate: new Date().toLocaleDateString(),
      invoiceNumber: 'INV-12345',
      client: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, Anytown, USA',
      },
      items: [
        {
          description: 'Web Design',
          quantity: 1,
          unitPrice: 500,
          totalAmount: 500,
        },
        {
          description: 'Hosting',
          quantity: 12,
          unitPrice: 10,
          totalAmount: 120,
        },
      ],
      totalAmount: 620,
    };
    return await generateHTMLFromTemplate(data, 'invoice');
  }

  async update(
    id: string,
    updateObject: Partial<Rental>,
    filterType?: string,
  ): Promise<any> {
    if (updateObject?.firm) {
      let [firm] = await this.commonService.firmFilter({
        id: updateObject.firm,
      });
      if (!firm) {
        throw new NotFoundException(
          `Firm with id ${updateObject.firm} not found`,
        );
      } else {
        updateObject.firm = firm;
      }
    }
    await this.rentalProductService.update(id, updateObject.rentalProduct);
    if (updateObject?.buyer) {
      let [buyer] = await this.commonService.buyerFilter({
        id: updateObject.buyer,
      });
      if (!buyer) {
        throw new NotFoundException(
          `Buyer with id ${updateObject.buyer} not found`,
        );
      } else {
        updateObject.buyer = buyer;
      }
    }
    if (updateObject?.paymentMode) {
      let [paymentMode] = await this.commonService.paymentModeFilter({
        id: updateObject.paymentMode,
      });
      if (!paymentMode) {
        throw new NotFoundException(
          `Payment Mode with id ${updateObject.paymentMode} not found`,
        );
      } else {
        updateObject.paymentMode = paymentMode;
      }
    }
    updateObject.pendingAmount
      ? (updateObject.invoiceStatus = InvoiceStatus.PartiallyPaid)
      : (updateObject.invoiceStatus = InvoiceStatus.Paid);
    delete updateObject?.rentalProduct;
    return await this.rentalRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.rentalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    delete filterCriteria.category;
    return await this.rentalRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: ['rentalProduct.product', 'buyer'],
    });
  }
}
