import { Request, Response } from 'express';
import { PermissionService } from '../services/PermissionService';
import { PermissionRepository } from '../repositories/PermissionRepository';
import { UserRoleRepository } from '../repositories/UserRoleRepository';
import { AppError } from '../utils/AppError';
import { UserRoleEnum } from '../entities/UserRole';

// Thêm quyền cho một role
export const addPermission = async (req: Request, res: Response) => {
  const { roleName, collection, action } = req.body;

  try {
    const permissionService = new PermissionService(PermissionRepository, UserRoleRepository);
    const permission = await permissionService.addPermission(roleName, collection, action);

    return res.status(201).json({
      status: 'success',
      message: 'Permission added successfully',
      data: permission,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details || null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add permission',
    });
  }
};

// Tạo role mới và gán quyền cho role
export const createRoleAndSetPermissions = async (req: Request, res: Response) => {
  const { roleName, permissions } = req.body;

  try {
    const permissionService = new PermissionService(PermissionRepository, UserRoleRepository);
    const role = await permissionService.createRoleAndSetPermissions(roleName, permissions);

    return res.status(201).json({
      status: 'success',
      message: 'Role created and permissions set successfully',
      data: role,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details || null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create role and set permissions',
    });
  }
};

// Xóa quyền của một role
export const deletePermission = async (req: Request, res: Response) => {
  const { roleName, collection, action } = req.body;

  try {
    const permissionService = new PermissionService(PermissionRepository, UserRoleRepository);
    await permissionService.deletePermission(roleName, collection, action);

    return res.status(200).json({
      status: 'success',
      message: 'Permission deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details || null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete permission',
    });
  }
};

// Xóa role và tất cả quyền của role đó
export const deleteRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;

  try {
    const permissionService = new PermissionService(PermissionRepository, UserRoleRepository);
    await permissionService.deleteRole(roleName);

    return res.status(200).json({
      status: 'success',
      message: 'Role and associated permissions deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details || null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete role',
    });
  }
};

// Lấy tất cả quyền của một role
export const getPermissions = async (req: Request, res: Response) => {
  const { roleName } = req.params;

  try {
    // Kiểm tra roleName có nằm trong enum UserRoleEnum không
    if (!Object.values(UserRoleEnum).includes(roleName as UserRoleEnum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role name',
      });
    }

    const permissionService = new PermissionService(PermissionRepository, UserRoleRepository);
    
    // Gọi hàm với roleName đã kiểm tra
    const permissions = await permissionService.getPermissions(roleName as UserRoleEnum);

    return res.status(200).json({
      status: 'success',
      message: 'Permissions retrieved successfully',
      data: permissions,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details || null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve permissions',
    });
  }
};
