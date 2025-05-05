import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { Subscription } from "./entities/subscription.entity";
import { buildFilterCriteriaQuery } from "../../common/utils";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const currentDate = new Date();
    const activeSubscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
      },
    });
    return !!activeSubscription;
  }

  async create(createObject: Partial<Subscription>): Promise<any> {
    const result = this.subscriptionRepository.create(createObject);
    return await this.subscriptionRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
  ): Promise<any> {
    return await this.subscriptionRepository.findAndCount({
      where: { deleteFlag: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id, deleteFlag: false },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateObject: Partial<Subscription>,
    filterType?: string,
  ): Promise<any> {
    return await this.subscriptionRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.subscriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.subscriptionRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }
}
