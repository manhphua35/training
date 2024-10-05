import { CategoryService } from '../services/CategoryService';
import { Request, Response } from 'express';

/**
 * Controller để lấy tất cả các danh mục
 * @param req Yêu cầu từ client
 * @param res Phản hồi lại client
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categoryService = new CategoryService();
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
