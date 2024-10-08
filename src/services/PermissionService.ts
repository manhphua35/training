import { Repository } from 'typeorm';
import { Permission } from '../entities/Permission';

export class PermissionService {
  constructor(
    private permissionRepository: Repository<Permission>
  ) {}

  async addPermission(nameofpermission: string, description?: string): Promise<Permission> {
    // Kiểm tra xem quyền đã tồn tại chưa
    const existingPermission = await this.permissionRepository.findOne({
      where: { nameofpermission }
    });

    if (existingPermission) {
      throw new Error(`Permission "${nameofpermission}" already exists.`);
    }

    // Tạo quyền mới
    const newPermission = this.permissionRepository.create({
      nameofpermission,
      description: description || ''
    });

    return this.permissionRepository.save(newPermission);
  }
}
