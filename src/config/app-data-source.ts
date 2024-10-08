import { DataSource } from "typeorm";
import { SubCategory } from "../entities/SubCategory";
import { MainCategory } from "../entities/MainCategory";
import { Product } from "../entities/Product";
import { ProductImage } from "../entities/ProductImage";
import 'dotenv/config';
import { CONNECTIONLIMIT, MAX_RETRY, RETRY_DELAY, SQLPORT } from "./constant";
import { User } from "../entities/User";
import { Permission } from "../entities/Permission";
import { UserRole } from "../entities/UserRole";
import { Route } from "../entities/Route";


export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: SQLPORT,
    username: process.env.USERDB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [Product, ProductImage, MainCategory, SubCategory, User, Permission, UserRole, Route],
    synchronize: true,
    extra: {
        connectionLimit: CONNECTIONLIMIT,  
        keepAlive: true      
    }
});


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

