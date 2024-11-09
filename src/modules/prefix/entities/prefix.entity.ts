import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Firm } from '../../firm/entities/firm.entity';
import { Module_Table } from '../../module/entities/module.entity';

@Entity('prefix')
export class Prefix extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'int', default: 0 })
  nextNumber: number;

  @ManyToOne(() => Firm, (firm) => firm.prefix)
  firm: Firm;

  @OneToOne(() => Module_Table)
  @JoinColumn()
  module: Module_Table;
}
