import "reflect-metadata";
import { DataSource } from "typeorm";
import { LinkModel } from "./model/LinkModel";
import dotenv from 'dotenv';

let isDevelopment = process.env.NODE_ENV === "development";

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const AppDataSource = isDevelopment ?
    new DataSource({
        type: "sqlite",
        database: `database.${process.env.NODE_ENV}.sqlite`,
        logging: false,
        entities: [LinkModel],
        migrations: ["src/migration/*.[t|j]s"],
        subscribers: [],
    }) :
    new DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: false,
        entities: [LinkModel],
        migrations: ["src/migration/*.[t|j]s"],
        subscribers: [],
    });
