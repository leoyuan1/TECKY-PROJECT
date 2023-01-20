import express from "express";
import path from "path";
import { petRoutes } from "./petRoutes";
import { app, PORT, server } from "./util/connection-config";
import { userRoutes } from "./login";
import { client } from './util/psql-config';
import { logger } from './util/logger';
import expressSession from "express-session";

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

// connect to database
logger.debug("database is connected.");

// user can upload media

app.use(
    expressSession({
        secret: "Tecky Academy teaches typescript",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use('/', userRoutes)
app.use('/pets', petRoutes);
// static files 
// app.use(express.static("pet template"));
app.use(express.static("public"));


// //  404
// app.use((req, res) => {
//     res.redirect('404.html')
// })

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});