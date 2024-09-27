import { MainCategoryRepository } from '../repositories/MainCategoryRepository';
import { ResError } from '../utils/ResError';

export class CategoryService {
  /**
   * Lấy tất cả danh mục cùng với các danh mục con
   * @returns Mảng các danh mục
   * @throws ResError Nếu không lấy được danh mục
   */
  public static async getAllCategories() {
    try {
      const categories = await MainCategoryRepository.find({
        relations: ['subCategories'],
      });
      return categories;
    } catch (error) {
      throw new ResError(400, 'Failed to fetch categories');
    }
  }
}
