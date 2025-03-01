import * as path from 'path';
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

console.log("path models", path.join(__dirname, "model/*{.ts,.js}"));
export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    entities: [path.join(__dirname, "model/*{.ts,.js}")],
    migrations: [path.join(__dirname, "migration/*{.ts,.js}")],
    subscribers: [],
});
