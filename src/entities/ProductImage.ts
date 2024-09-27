import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  url: string;

  @Column({ type: 'nvarchar', length: 50 })  
  public_id: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
