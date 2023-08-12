import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { LookEntity } from './look.entity';

@Entity({ name: 'look_products' })
export class LookProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LookEntity, (look) => look.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'lookId', referencedColumnName: 'id' })
  look: LookEntity;

  @Column({ type: 'int', nullable: false })
  lookId: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;
}
