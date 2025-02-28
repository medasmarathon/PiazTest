import "reflect-metadata";
import { DataSource } from "typeorm";
import { LinkModel } from "./model/LinkModel";
import dotenv from 'dotenv';

let isEnvUnset = process.env.NODE_ENV === undefined;

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const AppDataSource = isEnvUnset ?
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
