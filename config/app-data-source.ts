import { DataSource } from "typeorm";
import { Product } from "../src/entities/Product";
import { Image } from "../src/entities/Images";
import { MainCategory } from "../src/entities/MainCategory";
import { SubCategory } from "../src/entities/SubCategory";




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
    insecureAuth : true
});
