import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class DynamicSchema extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    entityName: string;

    @Column({ type: 'jsonb' })
    schemaDefinition: object;
}
