import { BaseEntity } from '../../../base/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('terms_and_conditions')
export class TermsAndConditions extends BaseEntity {
  @Column({ default: '' })
  value: string;

  @ManyToOne(() => Firm, (firm) => firm.termsAndConditions)
  firm: Firm;

  @Column('boolean', { default: false })
  default: boolean;
}
