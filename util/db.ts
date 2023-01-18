import pg from 'pg'
import dotenv from "dotenv";
dotenv.config();
export const client = new pg.Client({
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})
client.connect()