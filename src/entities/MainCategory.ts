import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SubCategory } from './SubCategory';

@Entity()
export class MainCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  mainCategoryName: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.mainCategory)
  subCategories: SubCategory[];
}
