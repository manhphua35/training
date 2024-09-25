import cloudinary from '../../config/cloudinaryConfig';
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';

export class ProductService {
  
  static async uploadImage(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'products',
        public_id: Date.now().toString(),
      });
      return result.secure_url; 
    } catch (error) {
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    console.log(productData.category)
    if (!productData.category) {
      throw new Error('Category is required');
    }

    const subCategory = await SubCategoryRepository.findOneBy({
      id: productData.category.id,
    });

    if (!subCategory) {
      throw new Error('SubCategory not found');
    }

    const product = ProductRepository.create({
      ...productData,
      category: subCategory,
    });

    return await ProductRepository.save(product);
  }
}
