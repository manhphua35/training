import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { Route } from '../entities/Route';
import { Permission } from '../entities/Permission';
import { UserRole } from '../entities/UserRole';
import { UserRepository } from '../repositories/UserRepository';
import { RouteRepository } from '../repositories/RouteCategory';

export const authorizePermission = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is missing' });
      }


      // Tìm người dùng với các vai trò và quyền của họ
      const user = await UserRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions'],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Tìm route tương ứng với endpoint và phương thức HTTP
      const route = await RouteRepository.findOne({
        where: { endpoint: req.path, method: req.method },
        relations: ['permissions'],
      });

      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }

      // Lấy danh sách các quyền cần thiết để truy cập route này
      const routePermissions = route.permissions.map((perm: Permission) => perm.id);

      // Kiểm tra người dùng có bất kỳ quyền nào trong số các quyền cần thiết hay không
      const userPermissions = user.roles.flatMap((role: UserRole) => role.permissions);

      const hasPermission = userPermissions.some((permission: Permission) =>
        routePermissions.includes(permission.id)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
    
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({
        message: 'Internal server error',
        error: errorMessage
      });
    }
    
  }
}
