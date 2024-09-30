
import { myDataSource } from '../config/app-data-source';
import { Product } from '../entities/Product';

export const ProductRepository = myDataSource.getRepository(Product);
