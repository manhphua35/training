import { myDataSource } from '../config/app-data-source';
import { Permission } from '../entities/Permission';

export const PermissionRepository = myDataSource.getRepository(Permission);
