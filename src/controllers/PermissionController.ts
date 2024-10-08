import { Request, Response } from 'express';
import { PermissionService } from '../services/PermissionService';
import { PermissionRepository } from '../repositories/PermissionRepository';

export const addPermission = async (req: Request, res: Response) => {
  const { nameofpermission, description } = req.body;

  try {
    const permissionService = new PermissionService(PermissionRepository);
    const permission = await permissionService.addPermission(nameofpermission, description);

    return res.status(201).json({
      status: 'success',
      message: 'Permission added successfully',
      data: permission,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
        details: error.stack || null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add permission',
    });
  }
};
