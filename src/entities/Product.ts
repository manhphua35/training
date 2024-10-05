import { Entity, Column, PrimaryColumn, ManyToOne, CreateDateColumn, BeforeInsert, OneToMany } from 'typeorm';
import { SubCategory } from './SubCategory'; 
import { ProductImage } from './ProductImage';
import { User } from './User';

@Entity()
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  serialNumber: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  category: SubCategory;

  @Column({ type: 'varchar', length: 50 })
  productName: string;

  @Column({ type: 'varchar', length: 50 })
  brand: string;

  @Column({ type: 'varchar', length: 50 })
  model: string;

  @Column({ type: 'enum', enum: ['new', 'used'] }) 
  conditional: string;

  @Column({ type: 'int' })
  yearOfManufacture: number;

  @Column({ type: 'int' })
  usageDuration: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'nvarchar', length: 50 })
  city: string;

  @Column({ type: 'nvarchar', length: 50 })
  postalCode: string;

  @Column({ type: 'nvarchar', length: 50 })
  specificAddress: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'enum', enum: ['USD', 'VND'] }) 
  currency: string;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];  


  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @Column()
  createdDate: Date;

  @BeforeInsert()
  setCreationDate() {
    this.createdDate = new Date();
  }
}
