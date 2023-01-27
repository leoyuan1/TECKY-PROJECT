import express from "express";
import path from "path";
import { logger } from './util/logger';
import { petRoutes } from "./petRoutes";
import { app, PORT, server } from "./util/connection-config";
import { userRoutes } from "./login";
import expressSession from "express-session";
import grant from "grant";
import { isLoggedIn } from "./util/guard";

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

// user can upload media
const grantExpress = grant.express({
    defaults: {
        origin: "http://localhost:8080",
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
app.use(
    expressSession({
        secret: "Tecky Academy teaches typescript",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use('/', userRoutes)
app.use('/pets', petRoutes);
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