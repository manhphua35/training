import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createByAdminSchema, registerSchema } from '../schemas/userSchema';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  const userData = registerSchema.parse(req.body);
  try {
    const result = await userService.register(userData);

    // Kiểm tra nếu là thông báo lỗi
    if (typeof result === 'string') {
      let statusCode = 400; // Mặc định là Bad Request

      // Đoán mã lỗi dựa trên thông báo
      if (result.includes('Password is required')) {
        statusCode = 400;
      } else if (result.includes('Email đã tồn tại')) {
        statusCode = 409; // Conflict
      } else if (result.includes('Vai trò khách hàng mặc định không tồn tại')) {
        statusCode = 500; // Server Error
      }

      return res.status(statusCode).json({ message: result });
    }

    // Trường hợp thành công
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


export const createUserByAdmin = async (req: Request, res: Response) => {
  try {
    const userData = createByAdminSchema.parse(req.body);

    // Call the service method to create a new user
    const result = await userService.createUserByAdmin(userData);

    // If the result is a string, it's an error message
    if (typeof result === 'string') {
      let statusCode = 400;

      // Determine status code based on error message
      if (result.includes('Email already exists')) {
        statusCode = 409; // Conflict
      } else if (result.includes('Default customer role not found')) {
        statusCode = 500; // Internal Server Error
      }

      return res.status(statusCode).json({ message: result });
    }

    // Successful creation
    return res.status(201).json(result);
  } catch (error) {

    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        
        message: 'Invalid data provided',
        errors: error.errors,
      });
    }

    // Handle other errors
    return res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};