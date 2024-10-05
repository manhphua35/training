import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { registerSchema} from '../schemas/userSchema';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const userData = registerSchema.parse(req.body);
    const result = await userService.register(userData);
    return res.status(201).json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: e.errors, 
      });
    }
    return res.status(500).json({ message: 'Lỗi khi đăng ký', error: e });
  }

};

// export const createUserByAdminController = async (req: Request, res: Response) => {
//   try {
//     // adminUser: Dữ liệu của admin từ token hoặc session
//     const adminUser = req.user; // Dữ liệu người dùng hiện tại (admin)
//     const userData = req.body;  // Dữ liệu người dùng mới

//     // Gọi hàm createUserByAdmin từ UserService
//     const result = await userService.createUserByAdmin(adminUser, userData);

//     res.status(201).json(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }

// }