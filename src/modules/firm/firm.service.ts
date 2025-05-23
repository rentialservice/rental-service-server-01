import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Firm } from "./entities/firm.entity";
import { buildFilterCriteriaQuery } from "../../common/utils";
import { CommonService } from "../common/common.service";
import { PaymentModeService } from "../payment-mode/payment-mode.service";
import { S3Service } from "../supporting-modules/s3/s3.service";
import { PrefixService } from "../prefix/prefix.service";
import { ModuleNameList } from "../../enums/module.enum";
import { TermsAndConditionsService } from "../terms-and-conditions/terms-and-conditions.service";
import { SubscriptionDetails } from "../subscription/entities/subscription-details.entity";
import { Subscription } from "../subscription/entities/subscription.entity";

@Injectable()
export class FirmService {
  constructor(
    @InjectRepository(Firm) private readonly firmRepository: Repository<Firm>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionDetails)
    private subscriptionDetailsRepository: Repository<SubscriptionDetails>,
    private readonly commonService: CommonService,
    private readonly paymentModeService: PaymentModeService,
    private readonly prefixService: PrefixService,
    private readonly termsAndConditionsService: TermsAndConditionsService,
    private readonly s3Service: S3Service
  ) {}

  async create(
    createObject: Partial<Firm>,
    media?: any,
    signature?: any
  ): Promise<any> {
    if (media) {
      createObject.media = await this.s3Service.uploadImageS3(
        media,
        (process.env.FIRM_MEDIA_FOLDER_NAME as string) || "FirmMedia"
      );
    }
    if (signature) {
      createObject.signature = await this.s3Service.uploadImageS3(
        signature,
        (process.env.FIRM_SIGNATURE_FOLDER_NAME as string) || "FirmSignature"
      );
    }
    // if (createObject?.category?.length) {
    //   let category = await this.commonService.categoryFilter({
    //     id: createObject.category,
    //   });
    //   if (!category?.length) {
    //     throw new NotFoundException(
    //       `Categories with id ${createObject.category} not found`,
    //     );
    //   }
    //   createObject.category = category;
    // }
    const result: any = this.firmRepository.create(createObject);
    let response: any = await this.firmRepository.save(result);
    await Promise.all([
      this.termsAndConditionsService.create(
        {
          default: true,
          value: `<!DOCTYPE html>
        <html>
        <body>
        <ul>
        <li>Renter must return items on time and in good condition; damages or loss incur charges.</li>
        <li>Full payment upfront; late returns and unreturned items may incur extra costs.</li>
        <li>Renter assumes all risks; company is not liable for misuse or injuries.</li>
        </ul>
        </body>
        </html>`,
        },
        { firm: response.id }
      ),
      this.paymentModeService.create({ firm: response.id, name: "CASH" }),
      this.paymentModeService.create({ firm: response.id, name: "BANK" }),
      this.prefixService.create(
        { module: ModuleNameList.Invoice, name: "INV" },
        { firm: response.id }
      ),
      this.prefixService.create(
        { module: ModuleNameList.Receipt, name: "RECEIPT" },
        { firm: response.id }
      ),
    ]);
    const subscription = await this.subscriptionRepository.findOne({
      where: { name: "Free Tier" },
    });
    if (!subscription) {
      throw new Error("'Free Tier' Subscription not found");
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Number(subscription.duration));
    const subscriptionDetails = this.subscriptionDetailsRepository.create({
      firm: response,
      subscription,
      startDate,
      endDate,
      price: subscription.basePrice,
    });
    await this.subscriptionDetailsRepository.save(subscriptionDetails);
    return response;
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string
  ): Promise<any> {
    return await this.firmRepository.findAndCount({
      where: { deleteFlag: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const firm = await this.firmRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ["subscription"],
    });
    if (!firm) {
      throw new NotFoundException(`Firm with id ${id} not found`);
    }
    return { ...firm, subscription: getActiveSubscription(firm) };
  }

  async updateSubscription(
    id: string,
    updateObject: Partial<Firm>,
    filterType?: string
  ): Promise<any> {
    return await this.firmRepository.update(id, updateObject);
  }

  async update(
    id: string,
    updateObject: Partial<Firm>,
    filterType?: string,
    media?: any,
    signature?: any
  ): Promise<any> {
    if (media) {
      updateObject.media = await this.s3Service.uploadImageS3(
        media,
        (process.env.FIRM_MEDIA_FOLDER_NAME as string) || "FirmMedia"
      );
    }
    if (signature) {
      updateObject.signature = await this.s3Service.uploadImageS3(
        signature,
        (process.env.FIRM_SIGNATURE_FOLDER_NAME as string) || "FirmSignature"
      );
    }
    // if (updateObject?.category?.length) {
    //   let category = await this.commonService.categoryFilter({
    //     id: updateObject.category,
    //   });
    //   if (!category?.length) {
    //     throw new NotFoundException(D
    //       `Categories with id ${updateObject.category} not found`,
    //     );
    //   }
    //   const firm = await this.firmRepository.findOne({
    //     where: { id },
    //     relations: ['category'],
    //   });
    //   if (!firm) {
    //     throw new NotFoundException(`Firm with id ${id} not found`);
    //   }
    //   firm.category = category;
    //   return await this.firmRepository.save(firm);
    // } else {
    // }
    return await this.firmRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.firmRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Firm with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string
  ): Promise<any> {
    return await this.firmRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }
}

function getActiveSubscription(firm: any) {
  const now = new Date();

  const activeSubscription = firm.subscription.find((sub: any) => {
    const startDate = new Date(sub.startDate);
    const endDate = new Date(sub.endDate);
    return sub.isActive && startDate <= now && endDate >= now;
  });

  if (!activeSubscription) return null;

  const endDate = new Date(activeSubscription.endDate);
  const remainingDays = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    ...activeSubscription,
    remainingDays,
  };
}
