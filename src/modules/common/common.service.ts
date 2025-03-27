import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prefix } from '../prefix/entities/prefix.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import { Firm } from '../firm/entities/firm.entity';
// import { Category } from '../category/entities/category.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Product } from '../product/entities/product.entity';
import { Buyer } from '../users/buyer/entities/buyer.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { Role } from '../role/entities/role.entity';
import { PaymentMode } from '../payment-mode/entities/payment-mode.entity';
import { TermsAndConditions } from '../terms-and-conditions/entities/terms-and-conditions.entity';
import { Rental } from '../rental/entities/rental.entity';
import { RentalProduct } from '../rental-products/entities/rental-product.entity';
import { PaymentCollection } from '../payment-collection/entities/payment-collection.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Prefix)
    private readonly prefixRepository: Repository<Prefix>,
    @InjectRepository(Firm) private readonly firmRepository: Repository<Firm>,
    // @InjectRepository(Category)
    // private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(PaymentMode)
    private readonly paymentModeRepository: Repository<PaymentMode>,
    @InjectRepository(TermsAndConditions)
    private readonly termsAndConditionsRepository: Repository<TermsAndConditions>,
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(RentalProduct)
    private readonly rentalProductRepository: Repository<RentalProduct>,
    @InjectRepository(PaymentCollection)
    private readonly paymentCollectionRepository: Repository<PaymentCollection>,
  ) {}

  async prefixFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.prefixRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async firmFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.firmRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  // async categoryFilter(
  //   filterCriteria: any,
  //   fields: string[] = [],
  //   filterType?: string,
  // ): Promise<any> {
  //   return await this.categoryRepository.find({
  //     where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
  //     relations: [...fields],
  //   });
  // }

  async permissionFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.permissionRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async productFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.productRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async rentalProductFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.rentalProductRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async buyerFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.buyerRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async subscriptionFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.subscriptionRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async roleFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.roleRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async paymentModeFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.paymentModeRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async termsAndConditionsFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.termsAndConditionsRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async rentalFilter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.rentalRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
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
}
