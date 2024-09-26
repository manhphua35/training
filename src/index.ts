import express, { Request, Response } from 'express';
import multer from 'multer';
import "reflect-metadata";
import 'dotenv/config';
import { connectWithRetry } from '../config/app-data-source';
import routes from './routes';
import cors from 'cors';

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
