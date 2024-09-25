import { Router } from 'express';
import { getAllCategories } from '../controllers/CategoryController';

const router = Router();

router.get('/getall', getAllCategories);

export default router;
