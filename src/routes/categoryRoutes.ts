import { Router } from 'express';
import { getAllCategories } from '../controllers/CategoryController';

const router = Router();

/**
 * @swagger
 * /api/category/getall:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: ID của danh mục
 *                   name:
 *                     type: string
 *                     description: Tên của danh mục
 *                   subCategories:
 *                     type: array
 *                     description: Danh sách các danh mục con
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 */
router.get('/getall', getAllCategories);

export default router;
