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