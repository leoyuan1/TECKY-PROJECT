import express from 'express';
import { Request, Response } from 'express';
import { io } from './util/connection-config';
import { PORT } from "./util/connection-config";

io.on('connection', function (socket) {
    console.log(`${socket.id} is connected to message box.`);
    socket.join('chat-room');
})

export const msgRoutes = express.Router();

msgRoutes.get('/people', getPeople);
msgRoutes.post('/user-id/:id', postMsg);

async function getPeople(req: Request, res: Response) {



}

async function postMsg(req: Request, res: Response) {

    // receive data from client
    const userID = req.params.id;
    const msg = req.body.content;

    // insert data to database

    // send data to client
    io.to('chat-room').emit('msg-sent', `echo: ${msg}`);
    res.json({ message: 'msg sent' })

}

// io.on("send-msg", sendMsg);
// function sendMsg(socket: any) {
//     socket.emit("msg-sent", { msg: "Your message has been sent." })
// }