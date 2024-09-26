import { Router } from 'express';
import multer from 'multer';
import { createProduct } from '../controllers/ProductControllers';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage, 
  });

const router = Router();

router.post('/create', upload.array('images', 10), createProduct);

export default router;
