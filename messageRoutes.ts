import express from 'express';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { io } from './util/connection-config';
// import { PORT } from "./util/connection-config";
import { client } from './util/psql-config';
import { logger } from './util/logger';

io.on('connection', function (socket) {

    const req = socket.request as express.Request;

    if (req.session['user']) {
        socket.join(`user-${req.session['user'].id}`);
        console.log(`${req.session['user'].id} is connected to message box.`);
    }

    // console.log(`${socket.id} is connected to message box.`);
    // socket.join('msg-box');

})

export const msgRoutes = express.Router();

msgRoutes.get('/user-id/:name', getUserID);
msgRoutes.get('/username/:id', getUsername);
msgRoutes.get('/people', getPeople);
msgRoutes.get('/to-user-id/:id', getMsgs);
msgRoutes.post('/to-user-id/:id', postMsg);

async function getUserID(req: Request, res: Response) {
    try {
        const name = req.params.name;
        const data = await client.query(`
            select id from users where username = $1
        `, [name]);
        const id = data.rows[0];

        if (!id) {
            res.status(400).json({
				message: 'Invalid username'
            });
            return;
        }

        res.json({
            data: id,
            message: 'id found'
        })
    } catch (error) {
        logger.error("... [MSG001] Server error ... " + error);
        res.status(500).json({ message: "[MSG001] Server error" });
    }
}

async function getUsername(req: Request, res: Response) {
    const id = req.params.id;
    const data = await client.query(`
        select username from users where id = $1
    `, [id]);
    const username = data.rows[0];
    
    res.json({
        data: username,
        message: 'username found'
    })
}

async function getMsgs(req: Request, res: Response) {

    // ensure session.user exists
    if (!req.session.user) {
        res.json({
            message: 'no session data',
        });
        return;
    }

    // receive user's data
    const fromID = req.session.user['id'];
    const toID = req.params.id;

    // get data from database
    const sqlString = `
        with selected_msgs as
        (
            select * from messages
            where (from_id = $1 or to_id = $1)
            and (from_id = $2 or to_id = $2)
        )
        
        select
            from_id,
            username as from_user,
            content,
            selected_msgs.created_at
        from selected_msgs
        join users on selected_msgs.from_id = users.id
        order by selected_msgs.created_at;
    `;

    // console.log('fromID = ', fromID);
    // console.log('toID = ', toID);

    const result = await client.query(sqlString, [fromID, toID]);

    const msgs = result.rows;

    // console.log('msgs = ', msgs);

    // send data to client
    res.json({
        data: msgs,
        message: 'msgs loaded'
    })

}

async function getPeople(req: Request, res: Response) {

    // console.log('getting people');

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
        (select from_id from messages m
            where (from_id = u.id and to_id = $1) or (to_id = u.id and from_id = $1)
            order by created_at desc limit 1
        ) as from_id,
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
    // io.to(`user-${userID}`).emit('reload-people', { data: people });
    res.json({
        data: people,
        message: `${userID} got people`
    })

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

    // send data to target user
    io.to(`user-${toID}`).emit('receive-msg', {
        data: { content: msg, from_id: fromID, to_id: toID },
        message: `msg sent from ${fromID} to ${toID}`
    });

    // send data to source user
    res.json({
        data: { content: msg, to_id: toID },
        message: `msg sent`
    })

}

// io.on("send-msg", sendMsg);
// function sendMsg(socket: any) {
//     socket.emit("msg-sent", { msg: "Your message has been sent." })
// }