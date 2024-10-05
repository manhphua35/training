import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { loginSchema } from '../schemas/userSchema';
import { AuthService } from '../services/AuthService';

// Đăng nhập người dùng
const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const loginData = loginSchema.parse(req.body);
    const result = await authService.login(loginData);
    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: e.errors, 
      });
    }
    return res.status(500).json({ message: 'Lỗi khi đăng nhập', error: e });
  }
};
