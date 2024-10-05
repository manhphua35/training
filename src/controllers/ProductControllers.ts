import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { validateImages } from '../utils/Validators';
import { productSchema } from '../schemas/productSchema';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';
import { AppError } from '../utils/AppError';
import { Product } from '../entities/Product';
import { MESSAGES, STATUS_TYPE, STATUS_CODES } from '../config/constant';

export const createProduct = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;


  //validate images
  if (!files || files.length === 0) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_TYPE.ERROR,
      error: MESSAGES.USER_ERROR.NO_IMAGE_UPLOADED,
    });
  }

  //validateImages(files);

  const parsedProduct = productSchema.safeParse(req.body);
  if (!parsedProduct.success) {
    const missingOrInvalidFields = parsedProduct.error.errors.map((err) => err.path.join('.'));
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_TYPE.ERROR,
      error: MESSAGES.USER_ERROR.INVALID_FIELDS,
      details: missingOrInvalidFields,
    });
  }

  const subCategory = await SubCategoryRepository.findOneBy({
    id: parsedProduct.data.category,
  });

  if (!subCategory) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      status: STATUS_TYPE.ERROR,
      error: MESSAGES.USER_ERROR.SUBCATEGORY_NOT_FOUND,
    });
  }

  const existingProduct = await ProductRepository.findOneBy({ serialNumber: parsedProduct.data.serialNumber });
  if (existingProduct) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_TYPE.ERROR,
      error: MESSAGES.USER_ERROR.PRODUCT_EXISTS,
    });
  }

  

  try {
    const productService = new ProductService();
    const imageBuffers = files.map(file => file.buffer);

    const productDataWithDefaults: Partial<Product> = {
      ...parsedProduct.data,
      category: subCategory,
      images: [],
      createdDate: new Date(),
    };

    const newProduct = await productService.createProduct(productDataWithDefaults as Product, imageBuffers);

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_TYPE.SUCCESS,
      message: MESSAGES.SUCCESS.PRODUCT_CREATED,
      data: newProduct,
    });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: STATUS_TYPE.ERROR,
        error: error.message,
        details: error.details || null,
      });
    } else {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: STATUS_TYPE.ERROR,
        error: MESSAGES.DB_ERROR.PRODUCT_CREATION_FAILED,
      });
    }
  }
};
