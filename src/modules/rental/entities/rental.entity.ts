import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Product } from '../../product/entities/product.entity';
import { Buyer } from '../../users/buyer/entities/buyer.entity';

@Entity('rental')
export class Rental extends BaseEntity {
    @OneToOne(() => Product)
    product: Product;

    @OneToOne(() => Buyer)
    buyer: Buyer;

    @Column({ default: new Date() })
    startDate: Date;

    @Column({ default: new Date() })
    endDate: Date;

    @Column({ type: 'simple-array', default: '' })
    media: string[];

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    salesPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    deposit: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    paidAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    fine: number;

    @Column({ default: 'CASH' })
    paymentMethod: string;

}
