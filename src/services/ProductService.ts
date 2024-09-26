import cloudinary from '../../config/cloudinaryConfig';
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';
import { ResError } from '../utils/ResError';  

export class ProductService {

  // Hàm upload ảnh với text overlay
  static async uploadImageFromBuffer(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: 'products',
        transformation: [
          {
            overlay: {
              font_family: "Arial", font_size: "10p", font_weight: "bold", text: "watermark"
            },
            gravity: "south_east", // Vị trí của text
            x: 5, y: 5,          // Khoảng cách so với góc
            color: "black",        // Màu chữ
            opacity: 70            // Độ trong suốt của nền
          }
        ]
      }, (error, result) => {
        if (error || !result) {
          return reject(new ResError(500, 'Failed to upload image to Cloudinary'));
        }
        resolve(result.secure_url);
      });

      uploadStream.end(buffer);  // Kết thúc stream và upload file
    });
  }

  // Hàm tạo sản phẩm
  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const existingProduct = await ProductRepository.findOneBy({ serialNumber: productData.serialNumber });
    if (existingProduct) {
      throw new ResError(400, 'Product with this serial number already exists');
    }

    if (!productData.category) {
      throw new ResError(400, 'Category is required');
    }

    const subCategory = await SubCategoryRepository.findOneBy({
      id: productData.category.id,
    });
    if (!subCategory) {
      throw new ResError(404, 'SubCategory not found');
    }

    const product = ProductRepository.create({
      ...productData,
      category: subCategory,
    });

    return await ProductRepository.save(product);
  }
}
