import { Router } from 'express';
import { createUserByAdmin, getAllUsers, register } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/authenticateToken';
import { authorizePermission } from '../middlewares/authorizePermission';

const router = Router();

router.post('/register', register);
router.post('/createUserByAdmin',authenticateToken,authorizePermission(), createUserByAdmin );
router.get('/getAllUsers', authenticateToken, authorizePermission(), getAllUsers);


export default router;
