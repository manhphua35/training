import { Router } from 'express';
import multer from 'multer';
import { createProduct } from '../controllers/ProductControllers';

const router = Router();
const upload = multer({ dest: 'uploads/' }); 

router.post('/create', upload.single('file'), createProduct);

export default router;
