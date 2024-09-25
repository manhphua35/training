import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { checkMissingFields } from '../validators/requiredFields';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'No image files uploaded' 
      });
    }

    const requiredFields = ['serialNumber', 'name', 'category', 'price', 'description', 'brand', 'model', 'condition', 'yearOfManufacture', 'usageDuration', 'title', 'weight', 'height', 'city', 'postalCode', 'specificAddress', 'currency'];

    const missingFields = checkMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        status: 'error', 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
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
    return res.status(500).json({ 
      status: 'error', 
      error: (error as Error).message 
    });
  }
};
