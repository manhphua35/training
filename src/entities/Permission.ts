import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserRole } from './UserRole'; // Đổi tên từ Role thành UserRole

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRole, (userRole) => userRole.permissions, { onDelete: 'CASCADE' })
  userRole: UserRole;

  @Column({ type: 'varchar', length: 50 })
  collection: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;
}
