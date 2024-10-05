import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../config/constant';
import { UserRepository } from '../repositories/UserRepository'; // Import UserRepository
import { UserRoleRepository } from '../repositories/UserRoleRepository'; // Import RoleRepository
import { User } from '../entities/User'; // Import User entity
import { UserRoleEnum, UserRole } from '../entities/UserRole'; // Import Role entity và UserRole enum
import { DeepPartial } from 'typeorm'; // Import DeepPartial từ TypeORM

export class UserService {
  // Hàm mã hóa mật khẩu
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Hàm kiểm tra mật khẩu
  async checkUserPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Kiểm tra xem người dùng có tồn tại hay không
  async checkUserExists(id: number): Promise<boolean> {
    const count = await UserRepository.count({ where: { id } });
    return count > 0;
  }

  // Đăng ký người dùng mới
  // Đăng ký người dùng mới
async register(userData: DeepPartial<User>) {
  const { nameofUser, email, password, phone, gender } = userData;

  // Kiểm tra nếu password bị thiếu
  if (!password) {
    throw new Error('Password is required');
  }

  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await UserRepository.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email đã tồn tại');
  }

  // Mã hóa mật khẩu bằng hàm hashPassword()
  const hashedPassword = await this.hashPassword(password);

  // Nếu người dùng chưa được gán role nào, gán role mặc định là 'CUSTOMER'
  const defaultRole = await UserRoleRepository.findOne({ where: { roleName: UserRoleEnum.CUSTOMER } });

  if (!defaultRole) {
    throw new Error('Vai trò khách hàng mặc định không tồn tại');
  }

  // Tạo người dùng mới
  const newUser = UserRepository.create({
    nameofUser,
    email,
    password: hashedPassword,
    phone,
    gender,
    roles: [defaultRole], // Gán role mặc định là 'CUSTOMER'
  });

  await UserRepository.save(newUser);

  return { message: 'Đăng ký thành công' };
}


  // Tạo người dùng mới thông qua admin
  async createUserByAdmin(adminUser: User, userData: DeepPartial<User>, roleName: UserRoleEnum): Promise<{ message: string }> {
    const { nameofUser, email, password, phone, gender } = userData;

    if (!password) {
      throw new Error('Password is required');
    }

    // Kiểm tra quyền của admin
    const isAdmin = adminUser.roles.some((role: UserRole) => role.roleName === UserRoleEnum.ADMIN);
    if (!isAdmin) {
      throw new Error('Bạn không có quyền tạo người dùng.');
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await this.hashPassword(password);

    // Tìm role cho người dùng được tạo
    const role = await UserRoleRepository.findOne({ where: { roleName } });
    if (!role) {
      throw new Error(`Vai trò ${roleName} không tồn tại`);
    }

    // Tạo người dùng mới với role do admin chỉ định
    const newUser = UserRepository.create({
      nameofUser,
      email,
      password: hashedPassword,
      phone,
      gender,
      roles: [role],
    });

    await UserRepository.save(newUser);

    return { message: 'Người dùng đã được tạo thành công bởi admin' };
  }
}
