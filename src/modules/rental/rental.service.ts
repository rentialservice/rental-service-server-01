import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { buildFilterCriteriaQuery, convertDate } from '../../common/utils';
import { CommonService } from '../common/common.service';
import {
  generateHTMLFromTemplate,
  generatePdfFromTemplate,
} from '../../common/common';
import { RentalProductService } from '../rental-products/rental-product.service';
import { InvoiceStatus } from '../../enums/status.enum';
import { PrefixService } from '../prefix/prefix.service';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    private readonly commonService: CommonService,
    private readonly prefixService: PrefixService,
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
      relations: ['buyer'],
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
    const rental = await this.rentalRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['buyer', 'rentalProduct', 'rentalProduct.product'],
    });
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    const data = {
      recipient: {
        name: rental?.buyer?.fullName,
        mobile: rental?.buyer?.phone,
        address:
          rental?.buyer?.address +
          ', ' +
          rental?.buyer?.city +
          ', ' +
          rental?.buyer?.state +
          ', ' +
          rental?.buyer?.pincode,
      },
      invoice: {
        number: rental.invoicePrefix + ' ' + rental.invoiceId,
        date: convertDate(rental.invoiceDate.toString()),
        items:
          rental?.rentalProduct?.map((rentalProduct: any, index: number) => {
            return {
              sr: index,
              product: rentalProduct?.product?.name || 'Product',
              description: rentalProduct?.product?.description || 'Description',
              deliveryDate: convertDate(rentalProduct?.startDate),
              returnDate: convertDate(rentalProduct?.endDate),
              qty: rentalProduct?.quantity || 1,
              rate: rentalProduct?.salesPrice || 0,
              total: rentalProduct?.salesPrice * rentalProduct?.quantity || 0,
            };
          }) || [],
        total: rental?.totalAmount || 0,
        discount: rental?.discount || 0,
        deposit: rental?.deposit || 0,
        advance: rental?.advanceAmount || 0,
        received: rental?.paidAmount || 0,
        outstanding: rental?.pendingAmount || 0,
        preparedBy: 'Rental Master',
      },
    };

    return await generatePdfFromTemplate(data, 'invoice');
  }

  async createInvoicePreview(id: string, filterType?: string): Promise<any> {
    const rental = await this.rentalRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['buyer', 'rentalProduct', 'rentalProduct.product'],
    });
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    const data = {
      recipient: {
        name: rental?.buyer?.fullName,
        mobile: rental?.buyer?.phone,
        address:
          rental?.buyer?.address +
          ', ' +
          rental?.buyer?.city +
          ', ' +
          rental?.buyer?.state +
          ', ' +
          rental?.buyer?.pincode,
      },
      invoice: {
        number: rental.invoicePrefix + ' ' + rental.invoiceId,
        date: convertDate(rental.invoiceDate.toString()),
        items:
          rental?.rentalProduct?.map((rentalProduct: any, index: number) => {
            return {
              sr: index,
              product: rentalProduct?.product?.name || 'Product',
              description: rentalProduct?.product?.description || 'Description',
              deliveryDate: convertDate(rentalProduct?.startDate),
              returnDate: convertDate(rentalProduct?.endDate),
              qty: rentalProduct?.quantity || 1,
              rate: rentalProduct?.salesPrice || 0,
              total: rentalProduct?.salesPrice * rentalProduct?.quantity || 0,
            };
          }) || [],
        total: rental?.totalAmount || 0,
        discount: rental?.discount || 0,
        deposit: rental?.deposit || 0,
        advance: rental?.advanceAmount || 0,
        received: rental?.paidAmount || 0,
        outstanding: rental?.pendingAmount || 0,
        preparedBy: 'Rental Master',
      },
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
    if (updateObject?.rentalProduct?.length) {
      await this.rentalProductService.update(id, updateObject.rentalProduct);
    }
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
      where: {
        ...buildFilterCriteriaQuery(filterCriteria),
        deleteFlag: false,
        order: { createdAt: 'DESC' },
      },
      relations: ['buyer'],
    });
  }
}
