import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",  
    password: "123456",  
    database: "ecommerce",
    entities: ["src/entities/*.ts"],  
    synchronize: true,
    ssl: false,
    insecureAuth : true
});
