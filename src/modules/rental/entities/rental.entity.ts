import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Product } from '../../product/entities/product.entity';
import { Buyer } from '../../users/buyer/entities/buyer.entity';
import { RentalPeriod } from '../../../enums/status.enum';
import { PaymentMode } from '../../payment-mode/entities/payment-mode.entity';
import { Firm } from '../../firm/entities/firm.entity';
import { PaymentCollection } from '../../payment-collection/entities/payment-collection.entity';

@Entity('rental')
export class Rental extends BaseEntity {
    @ManyToOne(() => Product, (product) => product.rental)
    product: Product;

    @ManyToOne(() => Buyer, (buyer) => buyer.rental)
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

    @ManyToOne(() => PaymentMode, (paymentMode) => paymentMode.rental)
    paymentMode: PaymentMode;

    @ManyToOne(() => Firm, (firm) => firm.rental)
    firm: Firm;

    @OneToMany(() => PaymentCollection, (paymentCollection) => paymentCollection.rental)
    paymentCollection: PaymentCollection[];
}