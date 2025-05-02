import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PaymentStatus,
  RefundStatus,
} from './entities/payment.entity';
import { buildFilterCriteriaQuery } from '../../common/utils';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async create(createObject: any): Promise<any> {
    const result = this.paymentRepository.create(createObject);
    return await this.paymentRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
    filterCriteria?: any,
  ): Promise<any> {
    delete filterCriteria?.category;
    return await this.paymentRepository.findAndCount({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({
      where: { id, deleteFlag: false },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async update(
    id: string,
    updateObject: Partial<Payment>,
    filterType?: string,
  ): Promise<any> {
    return await this.paymentRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    delete filterCriteria?.category;
    return await this.paymentRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async createOrder(
    userId: string,
    amount: number,
    currency = 'INR',
    receipt?: string,
  ) {
    try {
      const order = await this.razorpay.orders.create({
        amount: amount * 100, // Convert to smallest currency unit
        currency,
        receipt,
      });

      const payment = this.paymentRepository.create({
        user_id: userId,
        order_id: order.id,
        amount,
        currency,
        receipt,
        status: PaymentStatus.CREATED,
        metadata: order,
      });

      await this.paymentRepository.save(payment);
      return { orderId: order.id, payment };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create order: ' + error.message,
      );
    }
  }

  async verifyPayment(paymentData: {
    order_id: string;
    payment_id: string;
    signature: string;
  }) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { order_id: paymentData.order_id },
      });
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      // skipping signature verification
      // const generatedSignature = crypto
      //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      //   .update(`${paymentData.order_id}|${paymentData.payment_id}`)
      //   .digest('hex');

      // if (generatedSignature !== paymentData.signature) {
      //   throw new BadRequestException('Invalid payment signature');
      // }

      payment.payment_id = paymentData.payment_id;
      payment.signature = paymentData.signature;
      payment.status = PaymentStatus.AUTHORIZED;
      payment.captured_at = new Date();

      await this.paymentRepository.save(payment);
      return payment;
    } catch (error) {
      throw new BadRequestException(
        'Payment verification failed: ' + error.message,
      );
    }
  }

  async processRefund(paymentId: string, amount: number) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { payment_id: paymentId },
      });
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount * 100,
      });

      payment.refund_id = refund.id;
      payment.refund_status = RefundStatus.PENDING;
      payment.metadata = { ...payment.metadata, refund };
      await this.paymentRepository.save(payment);

      return refund;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to process refund: ' + error.message,
      );
    }
  }

  async verifyRefund(data: any) {
    try {
      const { paymentId, refundId } = data;

      const payment = await this.paymentRepository.findOne({
        where: { payment_id: paymentId },
      });
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      let refund_data: any;
      try {
        const refund: any = await this.razorpay.refunds.fetch(refundId);
        refund_data = {
          status: refund.status,
          amount: refund?.amount / 100, // Convert back to rupees
          speed_processed: refund.speed_processed,
          created_at: new Date(refund.created_at * 1000), // Convert Unix timestamp
          refund_id: refund.id,
          payment_id: refund.payment_id,
        };
      } catch (error) {
        console.error('Failed to check refund status:', error);
        throw error;
      }

      payment.refund_id = refundId;
      payment.refund_status =
        refund_data?.status === 'processed'
          ? RefundStatus.PROCESSED
          : RefundStatus.FAILED;
      payment.refunded_at = new Date();
      payment.status = PaymentStatus.REFUNDED;

      await this.paymentRepository.save(payment);
      return payment;
    } catch (error) {
      throw new BadRequestException(
        'Refund verification failed: ' + error.message,
      );
    }
  }

  async handleWebhook(webhookData: any, signature: string) {
    try {
      const isValidSignature = this.verifyWebhookSignature(
        JSON.stringify(webhookData),
        signature,
      );
      if (!isValidSignature) {
        throw new BadRequestException('Invalid webhook signature');
      }

      const event = webhookData.event;
      const paymentId = webhookData.payload?.payment?.entity?.id;
      const orderId = webhookData.payload?.payment?.entity?.order_id;

      const payment = await this.paymentRepository.findOne({
        where: { payment_id: paymentId, order_id: orderId },
      });
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      switch (event) {
        case 'payment.authorized':
          payment.status = PaymentStatus.AUTHORIZED;
          break;
        case 'payment.captured':
          payment.status = PaymentStatus.CAPTURED;
          payment.captured_at = new Date();
          break;
        case 'payment.failed':
          payment.status = PaymentStatus.FAILED;
          break;
        case 'refund.created':
          payment.refund_id = webhookData.payload.refund.entity.id;
          payment.refund_status = RefundStatus.PENDING;
          break;
        case 'refund.processed':
          payment.refund_status = RefundStatus.PROCESSED;
          payment.refunded_at = new Date();
          payment.status = PaymentStatus.REFUNDED;
          break;
      }

      payment.webhook_signature = signature;
      payment.metadata = { ...payment.metadata, webhook: webhookData };
      await this.paymentRepository.save(payment);

      return { status: 'Webhook processed successfully' };
    } catch (error) {
      throw new BadRequestException(
        'Webhook processing failed: ' + error.message,
      );
    }
  }

  private verifyWebhookSignature(body: string, signature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    return generatedSignature === signature;
  }
}
