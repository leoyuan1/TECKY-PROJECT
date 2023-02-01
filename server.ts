import express from "express";
import path from "path";
import { logger } from './util/logger';
import { petRoutes } from "./petRoutes";
import { msgRoutes } from "./messageRoutes";
import { app, PORT, server } from "./util/connection-config";
import { userRoutes } from "./userRoutes";
import expressSession from "express-session";
import grant from "grant";
import { isLoggedIn } from "./util/guard";
import { communityRoutes } from "./communityRoutes";
import { io } from "./util/connection-config";

// import { io } from "./util/connection-config";
// import { communityRoutes } from "./communities_route";

const Files = {
    APPLICATIONS: path.resolve("applications.json"),
};
interface Application {
    title: string;
    createdDate: string;
    updatedDate: string;
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const sessionMiddleware = expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
})

app.use(sessionMiddleware);
io.use((socket, next) => {
    let req = socket.request as express.Request;
    let res = req.res as express.Response;
    sessionMiddleware(req, res, next as express.NextFunction);
});

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use('/', userRoutes)
app.use('/pets', petRoutes);
app.use('/community', communityRoutes);
app.use('/msgs', msgRoutes);
// static files 
// app.use(express.static("pet template"));
app.use(grantExpress as express.RequestHandler);
app.use(isLoggedIn, express.static('protect'))

// //  404
// app.use((req, res) => {
//     res.redirect('404.html')
// })

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});