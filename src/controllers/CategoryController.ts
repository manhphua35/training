import { CategoryService } from '../services/CategoryService';
import { Request, Response } from 'express';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });

  }
};
