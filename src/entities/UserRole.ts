import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Permission } from './Permission'; // Import Permission entity
import { User } from './User'; // Import User entity

export enum UserRoleEnum {
  ADMIN = 'admin',
  PRODUCT_MANAGER = 'product_manager',
  ORDER_MANAGER = 'order_manager',
  CUSTOMER_SUPPORT = 'customer_support',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  GUEST = 'guest'
}

@Entity('user_roles') // Tên bảng cho bảng UserRole
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRoleEnum, unique: true })
  roleName: UserRoleEnum; // Sử dụng enum

  @OneToMany(() => Permission, (permission) => permission.userRole, { cascade: true })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
