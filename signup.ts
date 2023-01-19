import express from "express";
import { formidablePromise } from "./util/formidable";
import { client } from "./util/psql-config";
import { User } from "./util/session";

export const userRoutes = express.Router()
userRoutes.post('/signup', signup)
userRoutes.post('/login', login)


declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}
async function signup(req: express.Request, res: express.Response) {
    try {
        let { fields, files } = await formidablePromise(req)
        let selectUserResult = await client.query(`select * from users where email = $1`, [fields.email])
        let foundUser = selectUserResult.rows[0]

        if (foundUser) {
            res.json({
                message: "email registered"
            })
            return
        }

        let selectUsernameResult = await client.query(`select * from users where username = $1`, [fields.username])
        let foundUsername = selectUsernameResult.rows[0]

        if (foundUsername) {
            res.json({
                message: "username registered"
            })
            return
        }

        let fileName = files.image ? files.image['newFilename'] : ''

        const writeData = await client.query('INSERT INTO users (email,password,icon,username,created_at,updated_at) values ($1,$2,$3,$4,now(),now())',
            [fields.email,
            fields.password,
                fileName,
            fields.username,
            ]
        )
        res.json({
            message: "OK"
        })
    } catch (error) {
        console.log(error);
        res.end('not ok')
    }
}

async function login(req: express.Request, res: express.Response) {
    try {
        let { email, password } = await req.body
        console.log(email);

        let selectUserResult = await client.query(`select * from users where email = $1`, [email])
        let foundUser: User = selectUserResult.rows[0]

        if (!foundUser) {
            res.json({
                message: "email not register"
            })
            return
        }

        if (foundUser.email != email || foundUser.password != password) {
            res.json({
                message: "Invalid email or password"
            })
            return
        }
        req.session.user = foundUser
        res.json({
            message: "correct"
        })

    } catch (error) {
        console.log(error);
        res.end('not ok')
    }
}
