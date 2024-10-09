import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class Schema extends BaseEntity {
  @Column()
  productName: string;

  @Column()
  productPrice: number;
}
