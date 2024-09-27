import { DataSource } from "typeorm";
import { SubCategory } from "../src/entities/SubCategory";
import { MainCategory } from "../src/entities/MainCategory";
import { Product } from "../src/entities/Product";
import { ProductImage } from "../src/entities/ProductImage";

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: 3306,
    username: 'sql12731973',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [Product, ProductImage, MainCategory, SubCategory],
    synchronize: true,
    extra: {
        connectionLimit: 10,  
        keepAlive: true      
    }
});

const MAX_RETRY = 10;
const RETRY_DELAY = 60000;

export async function connectWithRetry() {
    let attempts = 0;
    while (attempts < MAX_RETRY) {
        try {
            await myDataSource.initialize();
            console.log("Data Source has been initialized!");

            setInterval(async () => {
                if (myDataSource.isInitialized) {
                    try {
                        await myDataSource.query('SELECT 1');  
                        console.log('Ping to keep connection alive');
                    } catch (err) {
                        console.error('Ping failed:', err);
                    }
                }
            }, 120000);  

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

