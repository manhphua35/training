// src/routes/index.ts
import { Application } from 'express';
import categoryRoutes from './categoryRoutes';  
import productRoutes from './productRoutes'

const routes = (app: Application): void => {
  app.use('/api/category', categoryRoutes);  
  app.use('/api/products', productRoutes );
};

export default routes;
