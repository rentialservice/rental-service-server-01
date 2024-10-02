import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class Firm  extends BaseEntity{
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;
}
