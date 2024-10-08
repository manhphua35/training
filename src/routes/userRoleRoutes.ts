import { Router } from 'express'; 
import { addPermission} from '../controllers/PermissionController'; 
import { authenticateToken } from '../middlewares/authenticateToken'; 
import { authorizePermission } from '../middlewares/authorizePermission';

const router = Router();

router.post('/addPermission',authenticateToken, authorizePermission(), addPermission);


export default router;
