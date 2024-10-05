import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserRole } from './UserRole'; // Đổi tên từ Role thành UserRole
import { Product } from './Product'; // Import Product entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  nameofUser: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
  gender: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  phone: string;

  // Quan hệ nhiều-nhiều với UserRole
  @ManyToMany(() => UserRole, (userRole: UserRole) => userRole.users)
  @JoinTable({
    name: 'user_roles_link',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' }, // Cột tham chiếu đến bảng User
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' } // Cột tham chiếu đến bảng UserRole
  })
  roles: UserRole[];

  // Quan hệ một-nhiều với Product
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  refreshToken: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  get formattedCreatedAt(): string {
    return this.createdAt ? this.formatDate(this.createdAt) : '';
  }

  get formattedUpdatedAt(): string {
    return this.updatedAt ? this.formatDate(this.updatedAt) : '';
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  @BeforeInsert()
  setCreationDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
