import { DataSource } from "typeorm";
import { SubCategory } from "../src/entities/SubCategory";
import { MainCategory } from "../src/entities/MainCategory";
import { Product } from "../src/entities/Product";
import { Image } from "../src/entities/Images";

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: 3306,
    username: 'sql12731973',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [Product, Image, MainCategory, SubCategory],
    synchronize: true,
    ssl: false,
    insecureAuth: true,
    extra: {
        connectionLimit: 10,  
        keepAlive: true       
    }
});

const MAX_RETRY = 10;
const RETRY_DELAY = 2000;

async function connectWithRetry() {
    let attempts = 0;
    while (attempts < MAX_RETRY) {
        try {
            await myDataSource.initialize();
            console.log("Data Source has been initialized!");
            break;
        } catch (err) {
            attempts++;
            console.error(`Attempt ${attempts} failed. Retrying in ${RETRY_DELAY / 1000} seconds...`);
            await new Promise(res => setTimeout(res, RETRY_DELAY));
        }
    }

    if (attempts === MAX_RETRY) {
        console.error("Could not connect to the database after multiple attempts.");
        process.exit(1);
    }
}

connectWithRetry();
