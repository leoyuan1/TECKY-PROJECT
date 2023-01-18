import express from "express";
import path from "path";
import { app, PORT, server } from "./connection-config";
import { userRoutes } from "./util/login";

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

app.use(userRoutes)
// static files 
// app.use(express.static("pet template"));
app.use(express.static("public"));

//  404
app.use((req, res) => {
    res.redirect('404.html')
})

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});