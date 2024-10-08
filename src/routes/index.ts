import { Application } from 'express';
import categoryRoutes from './categoryRoutes';  
import productRoutes from './productRoutes'
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import permissionRoutes  from './permissionRoutes'

const routes = (app: Application)=> {
  app.use('/api/category', categoryRoutes);  
  app.use('/api/products', productRoutes );
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/permission',  permissionRoutes)
};

export default routes;
