import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nameofpermission: string; // Tên quyền, ví dụ: 'CAN_VIEW_USERS', 'CAN_EDIT_PRODUCTS'

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả quyền để hiểu rõ hơn quyền này dùng để làm gì
}
