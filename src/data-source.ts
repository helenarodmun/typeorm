import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { Author } from "./entity/Author";

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Hekia*2020",
    database: "testorm",
    synchronize: true,//ensures that the entities will be synchronised with the database, each time the application is run.
    logging: false,
    entities: [User, Photo, PhotoMetadata, Author],
    migrations: [],
    subscribers: [],
})
