import { MESSAGES } from '../config/constant';
import { ICategoryService } from '../interfaces/ICategoryService';
import { MainCategoryRepository } from '../repositories/MainCategoryRepository';
import { AppError } from '../utils/AppError';

export class CategoryService implements ICategoryService{
  /**
   * Lấy tất cả danh mục cùng với các danh mục con
   * @returns Mảng các danh mục
   * @throws AppError Nếu không lấy được danh mục
   */
  async getAllCategories() {
    try {
      const categories = await MainCategoryRepository.find({
        relations: ['subCategories'],
      });
      return categories;
    } catch (error) {
      throw new AppError(400, MESSAGES.DB_ERROR.FETCH_CATEGORIES_FAILED);  // Sử dụng thông báo từ constant
    }
  }
}
