import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { validateImages } from '../utils/Validators';
import { productSchema } from '../schemas/productSchema';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';
import { AppError } from '../utils/AppError';
import { Product } from '../entities/Product';

const productService = new ProductService();


export const createProduct = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;

  // Validate images
  if (!files || files.length === 0) {
    return res.status(400).json({
      status: 'error',
      error: 'No image files uploaded', // Hardcoded message
    });
  }

  // Validate product data
  const parsedProduct = productSchema.safeParse(req.body);
  if (!parsedProduct.success) {
    const missingOrInvalidFields = parsedProduct.error.errors.map((err) => err.path.join('.'));
    return res.status(400).json({
      status: 'error',
      error: 'Missing or invalid fields', // Hardcoded message
      details: missingOrInvalidFields,
    });
  }

  // Check if subcategory exists
  const subCategory = await SubCategoryRepository.findOneBy({
    id: parsedProduct.data.category,
  });

  if (!subCategory) {
    return res.status(404).json({
      status: 'error',
      error: 'Subcategory not found', // Hardcoded message
    });
  }

  // Check if product with the same serial number exists
  const existingProduct = await ProductRepository.findOneBy({ serialNumber: parsedProduct.data.serialNumber });
  if (existingProduct) {
    return res.status(400).json({
      status: 'error',
      error: 'Product with this serial number already exists', // Hardcoded message
    });
  }

  try {
    const imageBuffers = files.map(file => file.buffer);

    const productDataWithDefaults: Partial<Product> = {
      ...parsedProduct.data,
      category: subCategory,
      images: [],
      createdDate: new Date(),
    };

    const newProduct = await productService.createProduct(productDataWithDefaults as Product, imageBuffers);

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully', // Hardcoded message
      data: newProduct,
    });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        error: error.message,
        details: error.details || null,
      });
    } else {
      return res.status(500).json({
        status: 'error',
        error: 'Error during product creation, please try again later', // Hardcoded message
      });
    }
  }

};



export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params; // Lấy productId từ params
  const updatedData = req.body;     // Lấy dữ liệu cần cập nhật từ body
  const userId = req.user?.userId;  // Lấy userId từ token đã xác thực

  try {
    // Gọi service để cập nhật sản phẩm
    const updatedProduct = await productService.updateProduct(productId, userId, updatedData);

    return res.status(200).json({
      status: 'success',
      message: 'Sản phẩm đã được cập nhật thành công',
      data: updatedProduct,
    });
  } catch (error) {
    // if (error.message === 'Product not found') {
    //   return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    // }
    // if (error.message === 'Unauthorized') {
    //   return res.status(403).json({ message: 'Bạn không có quyền cập nhật sản phẩm này' });
    // }
    return res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
  }
}