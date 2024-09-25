import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { MainCategory } from './MainCategory';
import { Product } from './Product';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  name: string;

  @ManyToOne(() => MainCategory, (mainCategory) => mainCategory.subCategories)
  @JoinColumn({ name: 'main_category_id' })  
  mainCategory: MainCategory;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
