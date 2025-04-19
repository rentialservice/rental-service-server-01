import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import {
  buildFilterCriteriaQuery,
  calculatePendingAmountWithFine,
  convertDate,
} from '../../common/utils';
import { CommonService } from '../common/common.service';
import {
  generateHTMLFromTemplate,
  generatePdfFromTemplate,
} from '../../common/common';
import { RentalProductService } from '../rental-products/rental-product.service';
import { InvoiceStatus } from '../../enums/status.enum';
import { PrefixService } from '../prefix/prefix.service';
import { RentalProduct } from '../rental-products/entities/rental-product.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(RentalProduct)
    private readonly rentalProductRepository: Repository<RentalProduct>,
    private readonly commonService: CommonService,
    private readonly prefixService: PrefixService,
    private readonly rentalProductService: RentalProductService,
  ) {}

  async create(createObject: Partial<Rental>, queryData: any): Promise<any> {
    if (!createObject?.rentalProduct?.length) {
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

    let [prefix] = await this.prefixService.filter({
      firm: queryData?.firm,
      name: createObject?.invoicePrefix,
    });

    if (!prefix) throw new NotFoundException('Prefix not found');
    await this.prefixService.update(prefix?.id, {
      nextNumber: parseInt(createObject.invoiceId) + 1,
    });

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

    console.dir({ createObject }, { depth: null });
    const result = this.rentalRepository.create(createObject);
    return await this.rentalRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
    filterCriteria?: any,
  ): Promise<any> {
    delete filterCriteria?.category;
    return await this.rentalRepository.findAndCount({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: ['buyer'],
      order: { createdAt: 'DESC' },
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
    let result: any = calculatePendingAmountWithFine(rental);
    await this.update(id, result);
    return { ...rental, ...result };
  }

  async getByIdDirect(id: string, filterType?: string): Promise<any> {
    const rental = await this.rentalRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['buyer', 'rentalProduct.product', 'firm'],
    });
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    let result: any = calculatePendingAmountWithFine(rental);
    await this.update(id, result);
    return { ...rental, ...result };
  }

  async createInvoice(id: string, filterType?: string): Promise<any> {
    const rental = await this.rentalRepository.findOne({
      where: { id, deleteFlag: false },
      relations: [
        'buyer',
        'rentalProduct',
        'rentalProduct.product',
        'firm',
        'paymentMode',
      ],
    });
    let transactions =
      await this.commonService.getPaymentCollectionsByRentalId(id);
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    const data = {
      company: {
        name: rental.firm.name,
        address:
          rental?.firm?.address +
          ', ' +
          rental?.firm?.city +
          ', ' +
          rental?.firm?.state,
        phone: rental.firm.phone,
        email: rental.firm.email,
      },
      customer: {
        name: rental.buyer.fullName,
        mobile: rental.buyer.phone,
        address:
          rental?.buyer?.address +
          ', ' +
          rental?.buyer?.city +
          ', ' +
          rental?.buyer?.state +
          ', ' +
          rental?.buyer?.pincode,
        delivery: 'Delivery Details Here',
      },
      invoiceNumber: rental.invoicePrefix + ' ' + rental.invoiceId,
      invoiceDate: convertDate(rental.invoiceDate.toString()),
      paymentMethod: rental.paymentMode.name,
      received: rental.isDepositRefunded
        ? rental.paidAmount
        : parseFloat(rental.paidAmount.toString()) +
          parseFloat(rental.deposit.toString()),
      items:
        rental?.rentalProduct?.map((rentalProduct: any, index: number) => {
          return {
            index: index + 1,
            product: rentalProduct?.product?.name || 'Product',
            photo: '',
            description: rentalProduct?.product?.description || 'Description',
            deliveryDate: convertDate(rentalProduct?.startDate),
            returnDate: convertDate(rentalProduct?.endDate),
            quantity: rentalProduct?.quantity || 1,
            rate: rentalProduct?.salesPrice || 0,
            total: rentalProduct?.salesPrice * rentalProduct?.quantity || 0,
          };
        }) || [],
      total: rental?.totalAmount || 0,
      discount: rental?.discount || 0,
      deposit: rental?.deposit || 0,
      advance: rental?.advanceAmount || 0,
      outstanding: rental?.pendingAmount || 0,
      transactions: transactions.map((transaction: any) => ({
        type: 'Receipt',
        number: transaction.receiptPrefix + ' ' + transaction.receiptId,
        date: convertDate(transaction.receiptDate),
        mode: transaction.paymentMode.name,
        amount: transaction.rental[0].amount,
      })),
      preparedBy: rental.firm.name,
    };
    return await generatePdfFromTemplate(data, 'invoice');
  }

  async createInvoicePreview(id: string, filterType?: string): Promise<any> {
    const rental = await this.rentalRepository.findOne({
      where: { id, deleteFlag: false },
      relations: [
        'buyer',
        'rentalProduct',
        'rentalProduct.product',
        'firm',
        'paymentMode',
      ],
    });
    let transactions =
      await this.commonService.getPaymentCollectionsByRentalId(id);
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    let isUnitAvailable = false;
    const data = {
      company: {
        name: rental.firm.name,
        address:
          rental?.firm?.address +
          ', ' +
          rental?.firm?.city +
          ', ' +
          rental?.firm?.state,
        phone: rental.firm.phone,
        email: rental.firm.email,
      },
      customer: {
        name: rental.buyer.fullName,
        mobile: rental.buyer.phone,
        address:
          rental?.buyer?.address +
          ', ' +
          rental?.buyer?.city +
          ', ' +
          rental?.buyer?.state +
          ', ' +
          rental?.buyer?.pincode,
        delivery: 'Delivery Details Here',
      },
      invoiceNumber: rental.invoicePrefix + ' ' + rental.invoiceId,
      invoiceDate: convertDate(rental.invoiceDate.toString()),
      paymentMethod: rental.paymentMode.name,
      received: rental.isDepositRefunded
        ? rental.paidAmount
        : parseFloat(rental.paidAmount.toString()) +
          parseFloat(rental.deposit.toString()),
      items:
        rental?.rentalProduct?.map((rentalProduct: any, index: number) => {
          isUnitAvailable = isUnitAvailable || !!rentalProduct?.unit;
          return {
            index: index + 1,
            product: rentalProduct?.product?.name || 'Product',
            photo: '',
            description: rentalProduct?.product?.description || 'Description',
            deliveryDate: convertDate(rentalProduct?.startDate),
            returnDate: convertDate(rentalProduct?.endDate),
            quantity: rentalProduct?.quantity || 1,
            rate: rentalProduct?.salesPrice || 0,
            unit: rentalProduct?.unit,
            total: rentalProduct?.salesPrice * rentalProduct?.quantity || 0,
          };
        }) || [],
      total: rental?.totalAmount || 0,
      discount: rental?.discount || 0,
      deposit: rental?.deposit || 0,
      advance: rental?.advanceAmount || 0,
      outstanding: rental?.pendingAmount || 0,
      transactions: transactions.map((transaction: any) => ({
        type: 'Receipt',
        number: transaction.receiptPrefix + ' ' + transaction.receiptId,
        date: convertDate(transaction.receiptDate),
        mode: transaction.paymentMode.name,
        amount: transaction.rental[0].amount,
      })),
      preparedBy: rental.firm.name,
      isUnitAvailable,
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
      updateObject.rentalProduct = await this.rentalProductService.update(
        id,
        updateObject.rentalProduct,
      );
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
    parseInt((updateObject?.pendingAmount as any) || '0')
      ? (updateObject.invoiceStatus = InvoiceStatus.PartiallyPaid)
      : (updateObject.invoiceStatus = InvoiceStatus.Paid);
    if (updateObject?.rentalProduct?.length) {
      if (updateObject.invoiceStatus === InvoiceStatus.Paid) {
        await this.rentalProductService.updateStatusAndRentedStock(
          updateObject?.rentalProduct,
        );
      }
    }
    delete updateObject?.rentalProduct;
    return await this.rentalRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: ['rentalProduct'],
    });
    console.dir({ rental }, { depth: null });
    let res = await this.rentalProductRepository.remove(rental.rentalProduct);
    console.log({ res });
    let res2 = await this.rentalRepository.remove(rental);
    console.log({ res2 });
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    delete filterCriteria?.category;
    return await this.rentalRepository.find({
      where: {
        ...buildFilterCriteriaQuery(filterCriteria),
        deleteFlag: false,
      },
      order: { createdAt: 'DESC' },
      relations: ['buyer', 'rentalProduct'],
    });
  }
}
