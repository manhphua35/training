import cloudinary from '../config/cloudinaryConfig';
import { AppError } from '../utils/AppError';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';
import { ProductImageRepository } from '../repositories/ProductImageRepository';
import { ProductImage } from '../entities/ProductImage';
import { Product } from '../entities/Product';

export class ProductService {

  async uploadImageFromBuffer(buffer: Buffer): Promise<{ url: string, public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: 'products',
        transformation: [
          {
            overlay: "logo_ufacjp",
            gravity: "south_east",
            x: 10, y: 10,
            width: "0.15",
            opacity: 70,
            flags: "relative"
          },
          {
            fetch_format: "auto",
            quality: "auto",
            format: "auto"
          }
        ]
      }, (error, result) => {
        if (error || !result) {
          return reject(new AppError(500, 'Failed to upload images')); // Hardcoded message
        }
        resolve({ url: result.secure_url, public_id: result.public_id });
      });

      uploadStream.end(buffer);
    });
  }

  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          return reject(new AppError(500, 'Failed to delete images from cloudinary')); // Hardcoded message
        }
        resolve();
      });
    });
  }

  async createProduct(productData: Product, imageBuffers: Buffer[]): Promise<Product> {
    const subCategory = await SubCategoryRepository.findOneBy({ id: productData.category.id });
    if (!subCategory) {
      throw new AppError(404, 'Subcategory not found'); // Hardcoded message
    }

    const product = ProductRepository.create({
      ...productData,
      category: subCategory,
    });

    const savedProduct = await ProductRepository.save(product);

    const uploadedImages: ProductImage[] = [];

    try {
      const imagePromises = imageBuffers.map(async (buffer) => {
        const { url, public_id } = await this.uploadImageFromBuffer(buffer);

        const image = ProductImageRepository.create({
          url,
          public_id,
          product: savedProduct,
        });

        return await ProductImageRepository.save(image);
      });

      const savedImages = await Promise.all(imagePromises);
      uploadedImages.push(...savedImages);

      return savedProduct;

    } catch (error) {

      await Promise.all(uploadedImages.map((image) => this.deleteImageFromCloudinary(image.public_id)));

      await ProductRepository.remove(savedProduct);

      throw new AppError(500, 'Error during product creation, please try again later'); 
    }
  }


  async updateProduct(productId: string, userId: any, updatedData: Partial<Product>): Promise<Product> {
    // Tìm sản phẩm theo productId và userId để đảm bảo người dùng sở hữu sản phẩm này
    const product = await ProductRepository.findOne({
      where: { serialNumber: productId, user: { id: userId } }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Cập nhật thông tin sản phẩm với dữ liệu mới từ body
    Object.assign(product, updatedData); 

    // Lưu sản phẩm đã được cập nhật
    await ProductRepository.save(product);

    return product;
  }

  
}
