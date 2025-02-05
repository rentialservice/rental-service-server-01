import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DynamicSchema } from './dynamic-schema.entity';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class DynamicData  extends BaseEntity {
    @ManyToOne(() => DynamicSchema)
    @JoinColumn({ name: 'schema_id' })
    schema: DynamicSchema;

    @Column({ type: 'jsonb' })
    data: object;
}
