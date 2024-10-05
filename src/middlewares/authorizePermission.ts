import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { Permission } from '../entities/Permission';

// Middleware kiểm tra quyền của người dùng
export const authorizePermission = (collection: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy thông tin người dùng đã được xác thực từ token
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Truy vấn người dùng và các quyền từ bảng permissions
      const user = await UserRepository.findOne({ where: { id: userId }, relations: ['roles', 'roles.permissions'] });

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Lấy danh sách quyền của người dùng từ vai trò
      const userPermissions = user.roles.flatMap(role => role.permissions);

      // Kiểm tra xem người dùng có quyền với collection và action được yêu cầu hay không
      const hasPermission = userPermissions.some((permission: Permission) => {
        return permission.collection === collection && permission.action === action;
      });

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
      }

      // Người dùng có quyền, cho phép tiếp tục
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
