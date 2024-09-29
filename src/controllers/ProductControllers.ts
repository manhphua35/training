import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { validateImages } from '../validators/imageValidator';
import { ResError } from '../utils/ResError';

export const createProduct = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
    
  if (!files || files.length === 0) {
    return res.status(400).json({
      status: 'error',
      error: 'No image files uploaded'
    });
  }

  try {
    validateImages(files);

    const productService = new ProductService();
    const imageBuffers = files.map(file => file.buffer);
    const newProduct = await productService.createProduct(req.body, imageBuffers);

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: newProduct
    });

  } catch (error) {
    if (error instanceof ResError) {
      return res.status(error.statusCode).json({
        status: 'error',
        error: error.message,
        details: error.details || null,  
      });
    } else {
      return res.status(500).json({
        status: 'error',
        error: 'Lỗi trong lúc tạo sản phẩm, hãy thử lại sau'
      });
    }
  }
};
