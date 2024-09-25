import { DataSource } from "typeorm";


console.log('Host:', process.env.HOST);


export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: 3306,
    username: 'sql12731973',  
    password: process.env.PASSWORD,  
    database: process.env.DATABASE,
    entities: ["src/entities/*.ts"],  
    synchronize: true,
    ssl: false,
    insecureAuth : true
});
