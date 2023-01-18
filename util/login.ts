import express from "express";
import { formidablePromise } from "./formidable";
import { client } from "./psql-config";

export const userRoutes = express.Router()
userRoutes.post('/signup', signup)

async function signup(req: express.Request, res: express.Response) {
    let { fields, files } = await formidablePromise(req)
    const getData = await client.query('select email, password from users')
}