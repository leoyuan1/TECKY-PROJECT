import express from "express";
import { Request, Response } from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

async function main() {
    await client.connect(); // "dial-in" to the postgres server
    const user = {
        email: "abc@gmail.com",
        username: "gordon",
        password: "tecky",
    };

    await client.query("INSERT INTO users (email,username,password,created_at,updated_at) values ($1,$2,$3,now(),now())", [
        user.email,
        user.username,
        user.password,
    ]);
}
main();


// app.get("/", function (req: Request, res: Response) {
//     res.end("Hello World");
// });

// static files 
app.use(express.static("public"));


//  404
app.use((req, res) => {
    res.redirect('404.html')
})

app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`);
});