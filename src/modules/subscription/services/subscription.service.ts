import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionDetails } from '../entities/subscription-details.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionDetails)
    private subscriptionDetailsRepository: Repository<SubscriptionDetails>
  ) {}

  async createSubscription(data: Partial<Subscription>) {
    const subscription = this.subscriptionRepository.create(data);
    return await this.subscriptionRepository.save(subscription);
  }

  async assignSubscriptionToFirm(subscriptionId: string, firmId: string, data: Partial<SubscriptionDetails>) {
    const subscriptionDetails = this.subscriptionDetailsRepository.create({
      ...data,
      subscription: { id: subscriptionId },
      firm: { id: firmId }
    });
    return await this.subscriptionDetailsRepository.save(subscriptionDetails);
  }

  async getSubscriptionsByFirm(firmId: string) {
    return await this.subscriptionDetailsRepository.find({
      where: { firm: { id: firmId }, isActive: true },
      relations: ['subscription']
    });
  }

  async getAllSubscriptions() {
    return await this.subscriptionRepository.find();
  }

  async createSubscriptionDetails(data: Partial<SubscriptionDetails>) {
    try {
      const subscriptionDetails = this.subscriptionDetailsRepository.create(data);
      return await this.subscriptionDetailsRepository.save(subscriptionDetails);
    } catch (error) {
      throw error;
    }
  }

  async updateSubscriptionDetails(id: string, data: Partial<SubscriptionDetails>) {
    try {
      await this.subscriptionDetailsRepository.update(id, data);
      return await this.subscriptionDetailsRepository.findOne({
        where: { id },
        relations: ['subscription', 'firm']
      });
    } catch (error) {
      throw error;
    }
  }
}