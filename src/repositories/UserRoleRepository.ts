import { myDataSource } from '../config/app-data-source';
import { UserRole } from '../entities/UserRole';

export const UserRoleRepository = myDataSource.getRepository(UserRole);
