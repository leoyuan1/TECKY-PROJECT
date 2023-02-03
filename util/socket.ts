import { Server } from "socket.io";
import express from "express";

export let io: Server;

export function setSocket(value: Server) {
    io = value;

    io.on("connection", function (socket) {
        const req = socket.request as express.Request;

        if (req.session["user"]) {
            socket.join(`user-${req.session["user"].id}`);

            // sql get joined room (12,13)
            // for ...n  join room

            io.to("12").emit("");

            console.log(`${req.session["user"].id} is connected to message box.`);
        }
    });
}
