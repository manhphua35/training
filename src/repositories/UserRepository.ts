import { myDataSource } from '../config/app-data-source';
import { User } from '../entities/User';

export const UserRepository = myDataSource.getRepository(User);
