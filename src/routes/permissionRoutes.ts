import { Router } from 'express'; 
import { addPermission} from '../controllers/PermissionController'; 
import { authenticateToken } from '../middlewares/authenticateToken'; 
import { authorizePermission } from '../middlewares/authorizePermission';

const router = Router();

router.post('/addPermission',authenticateToken, authorizePermission(), addPermission);
// router.post('/create-role', authenticateToken, authorizePermission('roles', 'create'), createRoleAndSetPermissions);

// router.delete('/delete-permission', authenticateToken, authorizePermission('permissions', 'delete'), deletePermission);

// router.delete('/delete-role', authenticateToken, authorizePermission('roles', 'delete'), deleteRole);

// router.get('/:roleName/permissions', authenticateToken, authorizePermission('permissions', 'read'), getPermissions);

export default router;
