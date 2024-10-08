import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { UserRoleRepository } from '../repositories/UserRoleRepository';
import { User } from '../entities/User';
import { UserRoleEnum } from '../entities/UserRole';
import { DeepPartial } from 'typeorm';

export class UserService {
  // Hàm mã hóa mật khẩu
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Đăng ký người dùng mới
  async register(userData: DeepPartial<User>) {
    const { nameofUser, email, password, phone, gender } = userData;

    // Kiểm tra nếu password bị thiếu
    if (!password) {
      return 'Password is required'; // Chỉ trả về thông báo lỗi
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      return 'Email đã tồn tại'; // Chỉ trả về thông báo lỗi
    }

    // Mã hóa mật khẩu
    const hashedPassword = await this.hashPassword(password);

    const defaultRole = await UserRoleRepository.findOne({ where: { roleName: UserRoleEnum.CUSTOMER } });

    if (!defaultRole) {
      return 'Vai trò khách hàng mặc định không tồn tại'; 
    }

    const newUser = UserRepository.create({
      nameofUser,
      email,
      password: hashedPassword,
      phone,
      gender,
      roles: [defaultRole],
    });

    await UserRepository.save(newUser);

    return { message: 'Đăng ký thành công' };
  }

  async createUserByAdmin(userData: DeepPartial<User>) {
    const { nameofUser, email, password, phone, gender, roles } = userData;

    // Check if the password is provided
    if (!password) {
      return 'Password is required';
    }

    // Check if the email is already in use
    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      return 'Email already exists';
    }

    // Hash the password before saving
    const hashedPassword = await this.hashPassword(password);

    // Find the roles provided by the admin or default to CUSTOMER role
    let assignedRoles;
    if (roles && roles.length > 0) {
      assignedRoles = await UserRoleRepository.findByIds(roles);
    } else {
      const defaultRole = await UserRoleRepository.findOne({ where: { roleName: UserRoleEnum.CUSTOMER } });
      if (!defaultRole) {
        return 'Default customer role not found';
      }
      assignedRoles = [defaultRole];
    }

    // Create the new user entity
    const newUser = UserRepository.create({
      nameofUser,
      email,
      password: hashedPassword,
      phone,
      gender,
      roles: assignedRoles,
    });

    // Save the new user to the database
    await UserRepository.save(newUser);

    return { message: 'User created successfully by admin' };
  }


  async getAllUsers() {
    // Lấy danh sách người dùng bao gồm quan hệ với `roles` và `products`
    const users = await UserRepository.find({
      relations: ['roles', 'products'],
    });
    return users;
  }
}


