import { MainCategoryRepository } from '../repositories/MainCategoryRepository';

export class CategoryService {
  public static async getAllCategories() {
    try {
      const categories = await MainCategoryRepository.find({
        relations: ['subCategories'],
      });
      return categories;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }
}
