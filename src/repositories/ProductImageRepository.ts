import { myDataSource } from '../config/app-data-source';
import { ProductImage } from '../entities/ProductImage';

export const ProductImageRepository = myDataSource.getRepository(ProductImage);
