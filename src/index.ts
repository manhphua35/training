import express, { Request, Response } from 'express';
import multer from 'multer';
import "reflect-metadata";
import dotenv from 'dotenv'
import { connectWithRetry } from './config/app-data-source';
import routes from './routes';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { z } from 'zod'
import { zodToTs } from 'zod-to-ts'
import bodyParser from 'body-parser';

dotenv.config()
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
        url: process.env.HOSTSV,
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};


const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
const port = process.env.PORT;


app.use(cors());

app.use(express.json()); 

routes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(port, async () => {
    console.log(`Server starting at port ${port}`);
    await connectWithRetry();  
});
