import express from "express";
import expressSession from "express-session";

const app = express();

// Add this line
app.use(
    expressSession({
        secret: "Tecky Academy teaches typescript",
        resave: true,
        saveUninitialized: true,
    })
);

interface User {
    email: string,
    username: string,
    icon?: string,
    password: string;
}

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}