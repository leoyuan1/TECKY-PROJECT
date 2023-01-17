import express from "express";
import { Request, Response } from "express";


const app = express();

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