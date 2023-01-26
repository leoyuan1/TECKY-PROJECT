import express from "express";
import { checkPassword, hashPassword } from "./util/bcrypt";
import { formidablePromise } from "./util/formidable";
import { client } from "./util/psql-config";
import { User } from "./util/session";
import fetch from 'cross-fetch';
import crypto from "crypto"
import session from "express-session";

export const userRoutes = express.Router()
// userRoutes.get('/admin', keepLogin)
userRoutes.post('/signup', signup)
userRoutes.post('/login', login)
userRoutes.get('/login/google', loginGoogle)
userRoutes.get('/session', isUser)
userRoutes.post('/setting', changePassword)

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}

export async function isUser(req: express.Request, res: express.Response) {
    if (!req.session.user) {
        res.json({
            message: 'no session data',
        })
        return
    }
    res.json({
        message: 'isUser',
        user: req.session.user
    })
}

// export async function keepLogin(req: express.Request, res: express.Response) {
//     let result = req.session.user
//     if (!result) {
//         res.json({
//             message: 'no session data',
//         })
//     }
//     res.json({
//         message: 'isUser',
//         user: req.session.user
//     })
// }

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

        let hashedPassword = await hashPassword(fields.password)
        const writeData = await client.query('INSERT INTO users (email,password,icon,username,created_at,updated_at) values ($1,$2,$3,$4,now(),now())',
            [fields.email,
                hashedPassword,
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
        let selectUserResult = await client.query(`select * from users where email = $1`, [email])
        let foundUser = selectUserResult.rows[0]
        if (!foundUser) {
            res.json({
                message: "email not register"
            })
            return
        }
        let dataPassword = foundUser.password
        let isPasswordValid = await checkPassword(password, dataPassword)
        if (!isPasswordValid) {
            res.json({
                message: 'Invalid password'
            })
            return
        }
        delete foundUser.password
        req.session.user = foundUser
        res.json({
            message: "correct"
        })

    } catch (error) {
        console.log(error);
        res.end('not ok')
    }
}

async function loginGoogle(req: express.Request, res: express.Response) {
    const accessToken = req.session?.['grant'].response.access_token;
    const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: "get",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    const result = await fetchRes.json();

    const users = (await client.query(`SELECT * FROM users WHERE email = $1`, [result.email])).rows;

    let user = users[0];

    if (!user) {
        let hashedPassword = await hashPassword(crypto.randomUUID())
        // Create the user when the user does not exist
        user = (await client.query(
            `INSERT INTO users (email,password,username,icon, created_at, updated_at)
                VALUES ($1,$2,$3,$4, now(), now()) RETURNING *`,
            [result.email,
                hashedPassword,
            result.name,
            result.picture
            ])
        ).rows[0]
    }
    delete user.password
    req.session['user'] = user
    res.redirect('/')
}

// const isLoggedIn = (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
// ) => {
//     if (req.session?.user) {
//         next()
//     } else {
//         res.redirect('/?error=no access right')
//     }
// };
// // admin.html should be inside protected
// app.use(isLoggedIn, express.static("protected"));

async function changePassword(req: express.Request, res: express.Response) {
    let { existPassword, NewPassword } = await req.body
    let existChecking = await existPassword
    let hashedPassword = await hashPassword(NewPassword)
    if (!req.session.user) {
        res.status(403).json({
            message: 'Not authorized'
        })
        return
    }
    let session = req.session.user
    let existDataPassword = await (await client.query(`select * from users where email = $1`, [session.email])).rows[0]
    let isPasswordValid = await checkPassword(existChecking, existDataPassword.password)
    if (!isPasswordValid) {
        res.status(404).json({
            message: 'Invalid password'
        })

        return
    }
    await client.query(
        `UPDATE users SET (password, updated_at) VALUES ($1,now()) WHERE email = $2`, [hashedPassword, session.email])
    res.json({
        message: "Updated Password"
    })
}

