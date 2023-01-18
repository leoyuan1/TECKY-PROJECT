import dotenv from "dotenv";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { connected } from "process";
import { format } from "fecha";
import path from "path";
import express, { Request, Response } from "express";
import multer from "multer";
import jsonfile from "jsonfile";
import expressSession from "express-session";
dotenv.config();


const app = express();
const server = new http.Server(app);
const io = new SocketIO(server);


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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname.split(".")[0]}-${Date.now()}.${file.originalname.split(".")[1]
            }`
        );
    },
});
const upload = multer({ storage });

// routes//

app.post("/application", async (req, res, next) => {
    try {
        const { title, created_at, updated_at } = req.body;
        const users: Application[] = await jsonfile.readFile(
            Files.APPLICATIONS
        );
        if (!title) {
            res.redirect("Must write the title");
            return;
        }
        users.push({
            title,
            createdDate: format(new Date(), "YYYY-MM-DD HH:mm:ss"),
            updatedDate: format(new Date(), "YYYY-MM-DD HH:mm:ss")
        });

    } catch (error) {
        console.log(error);
    }
})

// "connection" and "disconnection" event
io.on("connection", function (socket) {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


// static files 
// app.use(express.static("pet template"));
app.use(express.static("public"));


// //  404
// app.use((req, res) => {
//     res.redirect('404.html')
// })

app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`);
});