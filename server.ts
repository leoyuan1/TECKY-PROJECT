import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { userRoutes } from "./util/login";

const app = express();
const server = new http.Server(app);
const io = new SocketIO(server);

io.on("connection", function (socket) {
    console.log(socket);
})

app.use(userRoutes)
// static files 
// app.use(express.static("pet template"));
app.use(express.static("public"));

//  404
app.use((req, res) => {
    res.redirect('404.html')
})

server.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`);
});