import express, { Request, Response } from 'express';
import multer from 'multer';
import "reflect-metadata";
import 'dotenv/config';
import { myDataSource } from '../config/app-data-source';
import routes from './routes';

const app = express();
const port = process.env.PORT;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());


routes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
