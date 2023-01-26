import { logger } from './logger';

// library for postgreSQL
import pg from "pg";
import dotenv from "dotenv";

// postgreSQL's config
dotenv.config();
export const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

// connect to database
client.connect();
logger.debug("Database is connected.");