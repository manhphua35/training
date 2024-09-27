import cloudinary from '../../config/cloudinaryConfig';
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';
import { ProductImageRepository } from '../repositories/ProductImageRepository';  // Import ImageRepository
import { ResError } from '../utils/ResError';

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
          console.log('Upload Error:', error);
          return reject(new ResError(500, `Failed to upload image to Cloudinary`));
        }
        resolve({ url: result.secure_url, public_id: result.public_id });  
      });

      uploadStream.end(buffer);
    });
  }

  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.log(`Failed to delete image from Cloudinary: ${publicId}`, error);
          return reject(new ResError(500, `Failed to delete image from Cloudinary: ${publicId}`));
        }
        resolve();
      });
    });
  }

  async createProduct(productData: Partial<Product>, imageBuffers: Buffer[]): Promise<Product> {
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

    const savedProduct = await ProductRepository.save(product);  

    const uploadedImages = [];
    try {
      const imagePromises = imageBuffers.map(async (buffer) => {
        const { url, public_id } = await this.uploadImageFromBuffer(buffer);  
        const image = ProductImageRepository.create({
          url,
          public_id,  
          product: savedProduct,  
        });
        return ProductImageRepository.save(image);  
      });

      uploadedImages.push(...await Promise.all(imagePromises));  

      return savedProduct;  
    } catch (error) {
      await Promise.all(uploadedImages.map(image => this.deleteImageFromCloudinary(image.public_id)));
      await ProductRepository.remove(savedProduct);  
      throw error;
    }
  }
}
