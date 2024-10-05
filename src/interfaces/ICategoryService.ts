
import { MainCategory } from '../entities/MainCategory';

export interface ICategoryService {
  /**
   * Lấy tất cả các danh mục cùng với các danh mục con
   * @returns Mảng các đối tượng MainCategory
   */
  getAllCategories(): Promise<MainCategory[]>;
}
