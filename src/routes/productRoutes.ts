import { Router } from 'express';
import multer from 'multer';
import { createProduct} from '../controllers/ProductControllers';
import { authenticateToken } from '../middlewares/authenticateToken'; 
import { authorizePermission } from '../middlewares/authorizePermission';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

// Route tạo sản phẩm mới
router.post('/create', authenticateToken, authorizePermission(), upload.array('images', 10), createProduct );

// Route cập nhật sản phẩm


export default router;
