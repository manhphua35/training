import { Router } from 'express';
import multer from 'multer';
import { createProduct } from '../controllers/ProductControllers';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage, 
  });

const router = Router();
/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     description: Tạo một sản phẩm mới kèm với các hình ảnh sản phẩm (tối đa 10 hình ảnh, định dạng PNG và JPG, kích thước mỗi tệp không quá 5MB).
 *     tags:
 *       - Products
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Mã sản phẩm.
 *                 example: Testwatermark5
 *               productName:
 *                 type: string
 *                 description: Tên sản phẩm.
 *                 example: Sample Product
 *               category:
 *                 type: integer
 *                 description: ID của danh mục sản phẩm.
 *                 example: 1
 *               price:
 *                 type: number
 *                 description: Giá của sản phẩm.
 *                 example: 1000
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm.
 *                 example: Sample Description
 *               brand:
 *                 type: string
 *                 description: Thương hiệu sản phẩm.
 *                 example: Sample Brand
 *               model:
 *                 type: string
 *                 description: Mẫu sản phẩm.
 *                 example: Model X
 *               conditional:
 *                 type: string
 *                 enum: [new, used]
 *                 description: Trạng thái sản phẩm (mới hoặc đã qua sử dụng).
 *                 example: new
 *               yearOfManufacture:
 *                 type: integer
 *                 description: Năm sản xuất.
 *                 example: 2024
 *               usageDuration:
 *                 type: number
 *                 description: Thời gian sử dụng sản phẩm (theo tháng).
 *                 example: 150
 *               title:
 *                 type: string
 *                 description: Tiêu đề sản phẩm.
 *                 example: Sample Test
 *               weight:
 *                 type: number
 *                 description: Cân nặng của sản phẩm (theo gram).
 *                 example: 350
 *               height:
 *                 type: number
 *                 description: Chiều cao của sản phẩm (theo mm).
 *                 example: 800
 *               city:
 *                 type: string
 *                 description: Thành phố nơi sản phẩm được bán.
 *                 example: Ha Noi
 *               postalCode:
 *                 type: string
 *                 description: Mã bưu chính của địa điểm bán.
 *                 example: 1224
 *               specificAddress:
 *                 type: string
 *                 description: Địa chỉ chi tiết.
 *                 example: Ha Noi
 *               currency:
 *                 type: string
 *                 enum: [USD, VND]
 *                 description: Loại tiền tệ.
 *                 example: VND
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Các hình ảnh của sản phẩm (tối đa 10 hình ảnh, định dạng PNG và JPG).
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   type: object
 *                   description: Thông tin sản phẩm mới tạo.
 *       400:
 *         description: Lỗi xác thực hoặc liên quan đến tệp hình ảnh.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   description: Lý do lỗi.
 *                   examples:
 *                     validation:
 *                       value: Validation failed
 *                     image_size:
 *                       value: One or more files exceed the 5MB size limit
 *                     image_format:
 *                       value: Only PNG and JPG formats are allowed
 *                     image_count:
 *                       value: You can upload a maximum of 10 images
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Các trường thiếu hoặc không hợp lệ.
 *       404:
 *         description: Không tìm thấy danh mục sản phẩm.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: SubCategory not found
 *       500:
 *         description: Lỗi từ máy chủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Lỗi trong lúc tạo sản phẩm, hãy thử lại sau
 */



router.post('/create', upload.array('images', 10), createProduct);

export default router;
