import express from "express";
import { io } from "./connection-config";
import { formidablePromise } from "./formidable";
import { client } from "./psql-config";

export const userRoutes = express.Router()
userRoutes.post('/signup', signup)

async function signup(req: express.Request, res: express.Response) {
    let { fields, files } = await formidablePromise(req)
    console.log(fields)
    let content = fields.content
    let getUser = await client.query('select email from users where email = $1', [fields.email])
    if (getUser) {
        io.emit('Invalid email')
        return
    }
    let fileName = files.image ? files.image['newFilename'] : ''

    const writeData = await client.query('INSERT INTO users (email,password,icon,username,created_at,updated_at) value ($1,$2,$3,$4,$5,now(),now())',
        [content.email,
        content.password,
        files.icon,
        content.username,
        ]
    )
    console.log(writeData)
    io.emit('ok')

    
}

