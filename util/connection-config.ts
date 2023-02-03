import express from "express";
import cors from "cors";

// library for web socket
import http from "http";
import { Server as SocketIO } from "socket.io";
import expressSession from "express-session";
import { setSocket } from "./socket";
import grant from "grant";

export function buildServer() {
    // connection config (port, express and web socket)
    const PORT = 8080;
    const app = express();
    app.use(cors());

    const sessionMiddleware = expressSession({
        secret: "Tecky Academy teaches typescript",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    });

    app.use(sessionMiddleware);

    const grantExpress = grant.express({
        defaults: {
            origin: `http://localhost:${PORT}`,
            transport: "session",
            state: true,
        },
        google: {
            key: process.env.GOOGLE_CLIENT_ID || "",
            secret: process.env.GOOGLE_CLIENT_SECRET || "",
            scope: ["profile", "email"],
            callback: "/login/google",
        },
    });
    const server = new http.Server(app);
    const io = new SocketIO(server);
    app.use(express.json());

    io.use((socket, next) => {
        let req = socket.request as express.Request;
        let res = req.res as express.Response;
        sessionMiddleware(req, res, next as express.NextFunction);
    });

    setSocket(io);

    return {
        app,
        io,
        server,
        PORT,
        grantExpress,
    };
}
