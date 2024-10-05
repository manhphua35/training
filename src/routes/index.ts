import { Application } from 'express';
import categoryRoutes from './categoryRoutes';  
import productRoutes from './productRoutes'
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';

const routes = (app: Application): void => {
  app.use('/api/category', categoryRoutes);  
  app.use('/api/products', productRoutes );
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
};

export default routes;
