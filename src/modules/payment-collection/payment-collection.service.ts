import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PaymentCollection } from './entities/payment-collection.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { CommonService } from '../common/common.service';
import { RentalService } from '../rental/rental.service';
import { PrefixService } from '../prefix/prefix.service';
import {
  generateHTMLFromTemplate,
  generatePdfFromTemplate,
} from '../../common/common';

@Injectable()
export class PaymentCollectionService {
  constructor(
    @InjectRepository(PaymentCollection)
    private readonly paymentCollectionRepository: Repository<PaymentCollection>,
    private readonly commonService: CommonService,
    private readonly rentalService: RentalService,
    private readonly prefixService: PrefixService,
  ) {}

  async create(
    createObject: Partial<PaymentCollection>,
    queryData: any,
  ): Promise<any> {
    if (!createObject?.paymentMode) {
      throw new Error('Payment Mode is required');
    }
    if (!createObject?.rental?.length) {
      throw new Error('Rental is required');
    }
    if (!queryData?.firm) {
      throw new Error('Firm is required');
    }
    if (!createObject?.buyer) {
      throw new Error('Buyer is required');
    }

    let [prefix] = await this.prefixService.filter({
      firm: queryData?.firm,
      name: createObject?.receiptPrefix,
    });

    if (!prefix) throw new NotFoundException('Prefix not found');
    await this.prefixService.update(prefix?.id, {
      nextNumber: parseInt(createObject.receiptId) + 1,
    });

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
    if (createObject?.rental?.length) {
      for (const rental of createObject.rental) {
        let [rentalResponse] = await this.commonService.rentalFilter({
          id: rental?.id,
        });

        if (!rentalResponse) {
          throw new NotFoundException(`Rental with id ${rental?.id} not found`);
        } else if (
          parseFloat(rentalResponse?.pendingAmount) < parseFloat(rental?.amount)
        ) {
          throw new NotFoundException(
            `Receipt Amount ${rental?.amount} cannot be greater than Rental pending amount`,
          );
        }

        let updateObj = {
          pendingAmount:
            parseFloat(rentalResponse?.pendingAmount) - (rental?.amount || 0),
          paidAmount:
            parseFloat(rentalResponse?.paidAmount) + (rental?.amount || 0),
          isDepositRefunded: rental?.isDepositRefunded || false,
          isDepositDeducted: rental?.isDepositDeducted || false,
          deductedAmount: rental?.deductedAmount || 0,
        };

        await this.rentalService.update(rental?.id, updateObj);
      }
    }

    const result = this.paymentCollectionRepository.create(createObject);
    return await this.paymentCollectionRepository.save(result);
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
    delete filterCriteria?.category;
    if (!filterCriteria?.firm) {
      throw new Error('Firm is required');
    }
    let allRentals = await this.rentalService.filter(filterCriteria);
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
    let dailyTotal = 0;
    let monthlyTotal = 0;
    dailyPayments.map((item: any) => {
      dailyTotal += item?.rental?.reduce(
        (sum: any, payment: any) => sum + parseFloat(payment.amount),
        0,
      );
    });
    monthlyPayments.map((item: any) => {
      monthlyTotal += item?.rental?.reduce(
        (sum: any, payment: any) => sum + parseFloat(payment.amount),
        0,
      );
    });

    let dueTotal = allRentals?.reduce(
      (sum: any, rental: any) => sum + parseFloat(rental?.pendingAmount),
      0,
    );

    return { dailyTotal, monthlyTotal, dueTotal };
  }

  async getPaymentCollectionsByRentalId(
    rentalId: string,
  ): Promise<PaymentCollection[]> {
    return await this.paymentCollectionRepository
      .createQueryBuilder('paymentCollection')
      .leftJoinAndSelect('paymentCollection.paymentMode', 'paymentMode')
      .where('paymentCollection.rental @> :rentalId', {
        rentalId: JSON.stringify([{ id: rentalId }]),
      })
      .getMany();
  }

  async createReceipt(id: string, filterType?: string): Promise<any> {
    // const rental = await this.rentalRepository.findOne({
    //   where: { id, deleteFlag: false },
    //   relations: [
    //     'buyer',
    //     'rentalProduct',
    //     'rentalProduct.product',
    //     'firm',
    //     'paymentMode',
    //   ],
    // });
    // let transactions =
    //   await this.commonService.getPaymentCollectionsByRentalId(id);
    // if (!rental) {
    //   throw new NotFoundException(`Rental with id ${id} not found`);
    // }
    // const data = {
    //   company: {
    //     name: rental.firm.name,
    //     address:
    //       rental?.firm?.address +
    //       ', ' +
    //       rental?.firm?.city +
    //       ', ' +
    //       rental?.firm?.state,
    //     phone: rental.firm.phone,
    //     email: rental.firm.email,
    //   },
    //   customer: {
    //     name: rental.buyer.fullName,
    //     mobile: rental.buyer.phone,
    //     address:
    //       rental?.buyer?.address +
    //       ', ' +
    //       rental?.buyer?.city +
    //       ', ' +
    //       rental?.buyer?.state +
    //       ', ' +
    //       rental?.buyer?.pincode,
    //     delivery: 'Delivery Details Here',
    //   },
    //   invoiceNumber: rental.invoicePrefix + ' ' + rental.invoiceId,
    //   invoiceDate: convertDate(rental.invoiceDate.toString()),
    //   paymentMethod: rental.paymentMode.name,
    //   received: rental.isDepositRefunded
    //     ? rental.paidAmount
    //     : parseFloat(rental.paidAmount.toString()) +
    //       parseFloat(rental.deposit.toString()),
    //   items:
    //     rental?.rentalProduct?.map((rentalProduct: any, index: number) => {
    //       return {
    //         index: index + 1,
    //         product: rentalProduct?.product?.name || 'Product',
    //         photo: '',
    //         description: rentalProduct?.product?.description || 'Description',
    //         deliveryDate: convertDate(rentalProduct?.startDate),
    //         returnDate: convertDate(rentalProduct?.endDate),
    //         quantity: rentalProduct?.quantity || 1,
    //         rate: rentalProduct?.salesPrice || 0,
    //         total: rentalProduct?.salesPrice * rentalProduct?.quantity || 0,
    //       };
    //     }) || [],
    //   total: rental?.totalAmount || 0,
    //   discount: rental?.discount || 0,
    //   deposit: rental?.deposit || 0,
    //   advance: rental?.advanceAmount || 0,
    //   outstanding: rental?.pendingAmount || 0,
    //   transactions: transactions.map((transaction: any) => ({
    //     type: 'Receipt',
    //     number: transaction.receiptPrefix + ' ' + transaction.receiptId,
    //     date: convertDate(transaction.receiptDate),
    //     mode: transaction.paymentMode.name,
    //     amount: transaction.rental[0].amount,
    //   })),
    //   preparedBy: rental.firm.name,
    // };
    // return await generatePdfFromTemplate(data, 'receipt');
  }

  async createReceiptPreview(id: string, filterType?: string): Promise<any> {
    const receipt = await this.paymentCollectionRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['buyer', 'firm', 'paymentMode'],
    });
    if (!receipt) {
      throw new NotFoundException(`Receipt with id ${id} not found`);
    }
    // const data = {
    //   company: {
    //     name: rental.firm.name,
    //     address:
    //       rental?.firm?.address +
    //       ', ' +
    //       rental?.firm?.city +
    //       ', ' +
    //       rental?.firm?.state,
    //     phone: rental.firm.phone,
    //     email: rental.firm.email,
    //   },
    //   customer: {
    //     name: rental.buyer.fullName,
    //     mobile: rental.buyer.phone,
    //     address:
    //       rental?.buyer?.address +
    //       ', ' +
    //       rental?.buyer?.city +
    //       ', ' +
    //       rental?.buyer?.state +
    //       ', ' +
    //       rental?.buyer?.pincode,
    //     delivery: 'Delivery Details Here',
    //   },
    //   invoiceNumber: rental.invoicePrefix + ' ' + rental.invoiceId,
    //   invoiceDate: convertDate(rental.invoiceDate.toString()),
    //   paymentMethod: rental.paymentMode.name,
    //   received: rental.isDepositRefunded
    //     ? rental.paidAmount
    //     : parseFloat(rental.paidAmount.toString()) +
    //       parseFloat(rental.deposit.toString()),
    //   items:
    //     rental?.rentalProduct?.map((rentalProduct: any, index: number) => {
    //       return {
    //         index: index + 1,
    //         product: rentalProduct?.product?.name || 'Product',
    //         photo: '',
    //         description: rentalProduct?.product?.description || 'Description',
    //         deliveryDate: convertDate(rentalProduct?.startDate),
    //         returnDate: convertDate(rentalProduct?.endDate),
    //         quantity: rentalProduct?.quantity || 1,
    //         rate: rentalProduct?.salesPrice || 0,
    //         total: rentalProduct?.salesPrice * rentalProduct?.quantity || 0,
    //       };
    //     }) || [],
    //   total: rental?.totalAmount || 0,
    //   discount: rental?.discount || 0,
    //   deposit: rental?.deposit || 0,
    //   advance: rental?.advanceAmount || 0,
    //   outstanding: rental?.pendingAmount || 0,
    //   transactions: transactions.map((transaction: any) => ({
    //     type: 'Receipt',
    //     number: transaction.receiptPrefix + ' ' + transaction.receiptId,
    //     date: convertDate(transaction.receiptDate),
    //     mode: transaction.paymentMode.name,
    //     amount: transaction.rental[0].amount,
    //   })),
    //   preparedBy: rental.firm.name,
    // };
    return await generateHTMLFromTemplate('data', 'receipt');
  }
}
