import express from "express";
import path from "path";
import { msgRoutes } from "./routes/messageRoutes";
import { app, PORT, server } from "./util/connection-config";
import expressSession from "express-session";
import grant from "grant";
import { isLoggedIn } from "./util/guard";
import { communityRoutes } from "./routes/communityRoutes";
import { io } from "./util/connection-config";
import { makePetRoutes } from "./routes/petRoutes";
import { userRoutes } from "./routes/userRoutes";
import { client } from "./util/psql-config";
import { PetService } from "./services/petService";
import { PetController } from "./controllers/petController";
import { User } from "./util/session";

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

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}

app.use(sessionMiddleware);
io.use((socket, next) => {
    let req = socket.request as express.Request;
    let res = req.res as express.Response;
    sessionMiddleware(req, res, next as express.NextFunction);
});

app.use(grantExpress as express.RequestHandler);
app.use(express.static("public"));
app.use(express.static("uploads"));

// Application Routes
export const petService = new PetService(client);
export const petController = new PetController(petService);
console.log(petController.testing);

app.use('/', userRoutes)
app.use('/pets', makePetRoutes());
app.use('/msgs', msgRoutes);
app.use('/community', communityRoutes);

app.use(isLoggedIn, express.static('protect'));

// //  404
// app.use((req, res) => {
//     res.redirect('404.html')
// })

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});