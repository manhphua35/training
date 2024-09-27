import { MainCategoryRepository } from '../repositories/MainCategoryRepository';
import { ResError } from '../utils/ResError';

export class CategoryService {
  public static async getAllCategories() {
    try {
      const categories = await MainCategoryRepository.find({
        relations: ['subCategories'],
      });
      return categories;
    } catch (error) {
      throw new ResError(400,'Failed to fetch categories');
    }
  }
}
