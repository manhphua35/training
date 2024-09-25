import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { name, category, price, description } = req.body;
    if (!name || !category || !price || !description) {
      return res.status(400).json({ error: 'Product details are incomplete' });
    }

    const imageUrl = await ProductService.uploadImage(file.path);

    const productData = {
      ...req.body,
      images: imageUrl, 
    };

    const newProduct = await ProductService.createProduct(productData);

    res.status(201).json(newProduct);

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
