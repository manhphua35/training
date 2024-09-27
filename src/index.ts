import express, { Request, Response } from 'express';
import multer from 'multer';
import "reflect-metadata";
import 'dotenv/config';
import { connectWithRetry } from '../config/app-data-source';
import routes from './routes';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API thêm sản phẩm và lấy danh mục với Express và TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

const app = express();
const port = process.env.PORT;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

app.use(express.json()); 

routes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
    console.log(`Server starting at port ${port}`);
    await connectWithRetry();  
});
