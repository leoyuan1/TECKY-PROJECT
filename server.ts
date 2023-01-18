import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// static files 
app.use(express.static("public"));


//  404
app.use((req, res) => {
    res.redirect('404.html')
})

app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`);
});