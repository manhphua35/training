import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './Permission';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  endpoint: string; // Endpoint của route, ví dụ: '/products/:id', phải là duy nhất

  @Column({ type: 'varchar', length: 10 })
  method: string; // Phương thức HTTP, ví dụ: 'GET', 'POST', 'PUT', 'DELETE'

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả về route, ví dụ: 'Lấy thông tin chi tiết sản phẩm'

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'route_permissions',
    joinColumn: { name: 'route_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[]; // Danh sách các quyền có thể truy cập route này
}
