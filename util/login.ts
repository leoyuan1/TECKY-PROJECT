import express from "express";
import { client } from "./db";
import { formParsePromise } from "./formidable";

export const userRoutes = express.Router()
userRoutes.post('/signup', signup)

async function signup(req: express.Request, res: express.Response) {
    let { fields, files } = await formParsePromise(req)
    const getData = await client.query('select email, password from users')
}