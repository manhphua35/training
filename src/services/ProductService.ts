import { productSchema } from '../schemas/productSchema';
import { ResError } from '../utils/ResError';
import cloudinary from '../../config/cloudinaryConfig';
import { ProductRepository } from '../repositories/ProductRepository';
import { SubCategoryRepository } from '../repositories/SubCategoryRepository';
import { ProductImageRepository } from '../repositories/ProductImageRepository';

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
          return reject(new ResError(500, `Failed to delete image from Cloudinary: `));
        }
        resolve();
      });
    });
  }

  async createProduct(productData: any, imageBuffers: Buffer[]): Promise<any> {
    const parsedProduct = productSchema.safeParse(productData);
    if (!parsedProduct.success) {
      const missingOrInvalidFields = parsedProduct.error.errors.map((err) => err.path.join('.'));
      throw new ResError(400, 'Missing or invalid fields', missingOrInvalidFields);
    }

    const existingProduct = await ProductRepository.findOneBy({ serialNumber: parsedProduct.data.serialNumber });
    if (existingProduct) {
      throw new ResError(400, 'Product with this serial number already exists');
    }

    const subCategory = await SubCategoryRepository.findOneBy({
      id: parsedProduct.data.category,
    });

    if (!subCategory) {
      throw new ResError(404, 'SubCategory not found');
    }

    const product = ProductRepository.create({
      ...parsedProduct.data,
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
      await Promise.all(uploadedImages.map((image) => this.deleteImageFromCloudinary(image.public_id)));
      await ProductRepository.remove(savedProduct);
      throw new ResError(400, 'Sever error');
    }
  }

}
