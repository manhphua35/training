import { Permission } from '../entities/Permission'; // Import Permission entity
import { UserRole } from '../entities/UserRole'; // Import UserRole entity
import { Repository } from 'typeorm';
import { UserRoleEnum } from '../entities/UserRole'; // Import enum cho roleName

export class PermissionService {
  private permissionRepository: Repository<Permission>;
  private userRoleRepository: Repository<UserRole>;

  constructor(
    permissionRepository: Repository<Permission>, 
    userRoleRepository: Repository<UserRole>
  ) {
    this.permissionRepository = permissionRepository;
    this.userRoleRepository = userRoleRepository;
  }

  // Hàm thêm quyền cho một role
  async addPermission(roleName: UserRoleEnum, collection: string, action: string): Promise<Permission> {
    // Tìm role dựa trên tên
    const role = await this.userRoleRepository.findOne({ where: { roleName } });

    if (!role) {
      throw new Error(`Role với tên ${roleName} không tồn tại`);
    }

    // Kiểm tra xem quyền đã tồn tại cho role này chưa
    const existingPermission = await this.permissionRepository.findOne({
      where: { userRole: role, collection, action } // Cập nhật để kiểm tra quyền dựa trên vai trò, collection và action
    });

    if (existingPermission) {
      throw new Error(`Quyền này đã tồn tại cho vai trò ${roleName}`);
    }

    // Tạo quyền mới
    const newPermission = this.permissionRepository.create({
      userRole: role, // Liên kết với role đã tìm được
      collection,
      action,
    });

    return this.permissionRepository.save(newPermission); // Lưu quyền mới
  }

  // Hàm tạo một role và set quyền cho role đó
  async createRoleAndSetPermissions(roleName: UserRoleEnum, permissions: { collection: string; action: string }[]): Promise<UserRole> {
    // Tạo role mới
    const role = this.userRoleRepository.create({ roleName });

    await this.userRoleRepository.save(role);

    // Set quyền cho role mới tạo
    for (const permission of permissions) {
      await this.addPermission(roleName, permission.collection, permission.action);
    }

    return role;
  }

  // Hàm xóa một quyền của một role
  async deletePermission(roleName: UserRoleEnum, collection: string, action: string): Promise<void> {
    // Tìm role dựa trên tên
    const role = await this.userRoleRepository.findOne({ where: { roleName } });

    if (!role) {
      throw new Error(`Role với tên ${roleName} không tồn tại`);
    }

    const permissionToDelete = await this.permissionRepository.findOne({
      where: { userRole: role, collection, action }, // Cập nhật với `userRole` và các trường cần kiểm tra
    });

    if (!permissionToDelete) {
      throw new Error(`Quyền không tồn tại cho vai trò ${roleName} trên ${collection}`);
    }

    // Xóa quyền
    await this.permissionRepository.delete(permissionToDelete.id);
  }

  // Hàm xóa một role và tất cả các quyền của role đó
  async deleteRole(roleName: UserRoleEnum): Promise<void> {
    // Tìm role dựa trên tên
    const role = await this.userRoleRepository.findOne({ where: { roleName } });

    if (!role) {
      throw new Error(`Role với tên ${roleName} không tồn tại`);
    }

    // Xóa tất cả quyền của role này
    await this.permissionRepository.delete({ userRole: role });

    // Xóa role khỏi bảng roles
    await this.userRoleRepository.delete(role.id);
  }

  // Hàm lấy tất cả quyền của một role
  async getPermissions(roleName: UserRoleEnum): Promise<Permission[]> {
    // Tìm role dựa trên tên
    const role = await this.userRoleRepository.findOne({ where: { roleName } });

    if (!role) {
      throw new Error(`Role với tên ${roleName} không tồn tại`);
    }

    // Lấy tất cả quyền liên quan đến role này
    return this.permissionRepository.find({ where: { userRole: role } });
  }
}
