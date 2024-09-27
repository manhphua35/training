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
      'serialNumber', 'productName', 'category', 'price', 'description', 'brand', 
      'model', 'conditional', 'yearOfManufacture', 'usageDuration', 'title', 
      'weight', 'height', 'city', 'postalCode', 'specificAddress', 'currency'
    ];

    const missingFields = checkMissingFields(req.body, requiredFields);
    if (missingFields.length > 0) {
      throw new ResError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    const validConditionals = ['new', 'used'];
    const validCurrencies = ['USD', 'VND'];

    if (!validConditionals.includes(req.body.conditional)) {
      throw new ResError(400, `Invalid value for 'conditional'. Allowed values are: ${validConditionals.join(', ')}`);
    }

    if (!validCurrencies.includes(req.body.currency)) {
      throw new ResError(400, `Invalid value for 'currency'. Allowed values are: ${validCurrencies.join(', ')}`);
    }

    const numericFields = ['price', 'yearOfManufacture', 'usageDuration', 'weight', 'height'];
    
    numericFields.forEach((field) => {
      if (isNaN(req.body[field])) {
        throw new ResError(400, `Invalid value for '${field}'. It must be a number.`);
      }
    });

    if (req.body.price <= 0) {
      throw new ResError(400, 'Price must be a positive number.');
    }

    if (req.body.yearOfManufacture < 1900 || req.body.yearOfManufacture > new Date().getFullYear()) {
      throw new ResError(400, 'Invalid year of manufacture.');
    }

    if (req.body.usageDuration < 0) {
      throw new ResError(400, 'Usage duration must be a positive number.');
    }

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
