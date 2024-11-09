import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Product } from '../../product/entities/product.entity';
import { Buyer } from '../../users/buyer/entities/buyer.entity';
import { RentalPeriod } from '../../../enums/status.enum';

@Entity('rental')
export class Rental extends BaseEntity {
    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;

    @OneToOne(() => Buyer)
    @JoinColumn()
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

    @Column({
        type: 'enum',
        enum: RentalPeriod,
        default: RentalPeriod.RentPerHour,
    })
    rentalPeriod: string;

    @Column({ default: 'CASH' })
    paymentMethod: string;
}
