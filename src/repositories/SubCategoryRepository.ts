import { myDataSource } from '../config/app-data-source';
import { SubCategory } from '../entities/SubCategory';

export const SubCategoryRepository = myDataSource.getRepository(SubCategory);
