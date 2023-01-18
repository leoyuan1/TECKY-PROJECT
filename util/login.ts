import express from "express";
import { formidablePromise } from "./formidable";
import { client } from "./psql-config";

export const userRoutes = express.Router()
userRoutes.post('/signup', signup)

async function signup(req: express.Request, res: express.Response) {
    let { fields, files } = await formidablePromise(req)
    const getData = await client.query('select email from users where email = $1', [fields.email])
    const foundUser = fields.email.row[0]
    if (foundUser) {
        res.status(402).json({
            message: 'Invalid email'
        })
        return
    }
    const writeData = await client.query('INSERT INTO users (email,password,icon,username,created_at,updated_at) value ($1,$2,$3,$4,$5,now(),now())',
        [fields.email,
        fields.password,
        files.icon,
        fields.username,

        ]

    )
}

