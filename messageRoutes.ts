import express from 'express';
import { Request, Response } from 'express';
import { io } from './util/connection-config';
// import { PORT } from "./util/connection-config";
import { client } from './util/psql-config';

io.on('connection', function (socket) {
    console.log(`${socket.id} is connected to message box.`);
    socket.join('msg-box');
})

export const msgRoutes = express.Router();

msgRoutes.get('/people', getPeople);
msgRoutes.post('/to-user-id/:id', postMsg);

async function getPeople(req: Request, res: Response) {

    // ensure session.user exists
    if (!req.session.user) {
        res.json({
            message: 'no session data',
        });
        return;
    }

    // receive user's data
    const userID = req.session.user['id'];

    // get data from database

    const sqlString = `
        with
        chat_list as
        (
            select from_id as user_id from messages m where from_id = $1 or to_id = $1
            union 
            select to_id as user_id  from messages m where from_id = $1 or to_id = $1
        ),
        my_chat_list as
        (
            select * from chat_list where user_id <> $1
        )
        
        select
        u.id,
        u.username,
        u.icon,
        (select content from messages m
            where (from_id = u.id and to_id = $1) or (to_id = u.id and from_id = $1)
            order by created_at desc limit 1
        ) as last_message,
        (select created_at from messages m
            where (from_id = u.id and to_id = $1) or (to_id = u.id and from_id = $1)
            order by created_at desc limit 1
        ) as last_date
        from my_chat_list join users u on u.id = my_chat_list.user_id;
    `;

    const result = await client.query(sqlString, [userID]);

    // const result = await client.query(`
    //     select distinct to_id from messages
    //     where from_id = $1`, [fromID]);

    const people = result.rows;

    // send data to client
    io.to('msg-box').emit('reload-people', { data: people });
    res.json({ message: 'people loaded' })

}

async function postMsg(req: Request, res: Response) {

    // ensure session.user exists
    if (!req.session.user) {
        res.json({
            message: 'no session data',
        });
        return;
    }

    // receive data from client
    const fromID = req.session.user['id'];
    const toID = req.params.id;
    const msg = req.body.content;

    // insert data to database
    await client.query(`
        insert into messages (content, from_id, to_id, created_at, updated_at)
        values ($1,$2,$3,now(),now())
    `, [msg, fromID, toID]);

    // send data to client
    res.json({ message: 'msg sent' })

}

// io.on("send-msg", sendMsg);
// function sendMsg(socket: any) {
//     socket.emit("msg-sent", { msg: "Your message has been sent." })
// }