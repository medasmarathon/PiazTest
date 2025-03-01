import { default as path } from 'path';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { LinkModel } from "./model/LinkModel";
import dotenv from 'dotenv';

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    entities: [path.join(__dirname, "./model/*.[t|j]s")],
    migrations: [path.join(__dirname, "./migration/*.[t|j]s")],
    subscribers: [],
});
