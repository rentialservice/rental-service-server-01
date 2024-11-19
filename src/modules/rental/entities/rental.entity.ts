import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Product } from '../../product/entities/product.entity';
import { Buyer } from '../../users/buyer/entities/buyer.entity';
import { RentalPeriod } from '../../../enums/status.enum';
import { PaymentMode } from '../../payment-mode/entities/payment-mode.entity';
import { Firm } from '../../firm/entities/firm.entity';
import { PaymentCollection } from '../../payment-collection/entities/payment-collection.entity';

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
    totalAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    fine: number;

    @Column({
        type: 'enum',
        enum: RentalPeriod,
        default: RentalPeriod.RentPerHour,
    })
    rentalPeriod: string;

    @OneToOne(() => PaymentMode)
    @JoinColumn()
    paymentMode: PaymentMode;

    @ManyToOne(() => Firm, (firm) => firm.rental)
    firm: Firm;

    @OneToMany(() => PaymentCollection, (paymentCollection) => paymentCollection.rental)
    paymentCollection: PaymentCollection[];
}
