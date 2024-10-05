
import { Buffer } from 'buffer';
import { Product } from '../entities/Product';

export interface IProductService {
  /**
   * Upload ảnh từ buffer lên Cloudinary
   * @param buffer Dữ liệu của file ảnh dưới dạng buffer
   * @returns Đối tượng chứa URL và public_id của ảnh đã upload
   */
  uploadImageFromBuffer(buffer: Buffer): Promise<{ url: string, public_id: string }>;

  /**
   * Xóa ảnh từ Cloudinary dựa trên public_id
   * @param publicId public_id của ảnh trên Cloudinary
   * @returns void (thực hiện xóa ảnh)
   */
  deleteImageFromCloudinary(publicId: string): Promise<void>;

  /**
   * Tạo một sản phẩm mới và upload ảnh đi kèm
   * @param productData Thông tin sản phẩm cần tạo (entity Product)
   * @param imageBuffers Mảng buffer chứa dữ liệu các ảnh cần upload
   * @returns Promise trả về đối tượng Product đã được tạo thành công
   */
  createProduct(productData: Product, imageBuffers: Buffer[]): Promise<Product>;
}
