import { Router } from 'express';
import multer from 'multer';
import { createProduct } from '../controllers/ProductControllers';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 5 * 1024 * 1024 } 
  });

const router = Router();

router.post('/create', upload.array('images', 5), createProduct);

export default router;
