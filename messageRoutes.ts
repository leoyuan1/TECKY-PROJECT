import express from 'express';
import { Request, Response } from 'express';
import { io } from './util/connection-config';
import { PORT } from "./util/connection-config";
import { client } from './util/psql-config';

io.on('connection', function (socket) {
    console.log(`${socket.id} is connected to message box.`);
    socket.join('chat-room');
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
    const fromID = req.session.user['id'];

    // get data from database
    const result = await client.query(`
        select * from messages
        where from_id = $1`, [fromID]);
    const people = result.rows;

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
    io.to('chat-room').emit('msg-sent', `echo: ${msg}`);
    res.json({ message: 'msg sent' })

}

// io.on("send-msg", sendMsg);
// function sendMsg(socket: any) {
//     socket.emit("msg-sent", { msg: "Your message has been sent." })
// }