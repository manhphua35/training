
import { myDataSource } from '../../config/app-data-source';
import { MainCategory } from '../entities/MainCategory';

export const MainCategoryRepository = myDataSource.getRepository(MainCategory);
