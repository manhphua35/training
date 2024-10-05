import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Sử dụng jwt chữ thường
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  
  
  async login(loginData: any) {
    const { email, password } = loginData;
  
    // Tìm user và lấy roles qua quan hệ
    const user = await UserRepository.findOne({
      where: { email },
      relations: ['roles'], // Lấy thông tin roles từ bảng liên kết
    });
  
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  
    // Map qua mảng roles để chỉ lấy roleName
    const roles = user.roles.map((role) => role.roleName); // Lấy tất cả các roleName
  
    // Tạo token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles, // Chỉ lưu danh sách roleName
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );
  
    return {
      message: 'Đăng nhập thành công',
      token,
    };
  }
  
}
