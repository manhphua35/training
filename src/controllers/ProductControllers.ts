import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { checkMissingFields } from '../validators/requiredFields';
import { validateImages } from '../validators/imageValidator';
import { ResError } from '../utils/ResError';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      throw new ResError(400, 'No image files uploaded');
    }

    validateImages(files);

    const requiredFields = [
      'serialNumber', 'name', 'category', 'price', 'description', 'brand', 
      'model', 'conditional', 'yearOfManufacture', 'usageDuration', 'title', 
      'weight', 'height', 'city', 'postalCode', 'specificAddress', 'currency'
    ];

    const missingFields = checkMissingFields(req.body, requiredFields);
  if (missingFields.length > 0) {
    throw new ResError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

    const imageUrls = await Promise.all(
      files.map(file => ProductService.uploadImageFromBuffer(file.buffer))
    );

    const productData = {
      ...req.body,
      images: imageUrls,
    };

    const newProduct = await ProductService.createProduct(productData);

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: newProduct
    });

  } catch (error) {
    if (error instanceof ResError) {
      return res.status(error.statusCode).json({
        status: 'error',
        error: error.message
      });
    } else {
      return res.status(500).json({
        status: 'error',
        error: 'Lỗi trong lúc tạo sản phẩm, hãy thử lại sau'
      });
    }
  }
};
