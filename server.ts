import express from "express";
import { petRoutes } from "./routes/petRoutes";
import { msgRoutes } from "./routes/messageRoutes";
import { buildServer } from "./util/connection-config";
import { isLoggedIn } from "./util/guard";
import { communityRoutes } from "./routes/communityRoutes";
import { userRoutes } from "./routes/userRoutes";

interface Application {
    title: string;
    createdDate: string;
    updatedDate: string;
}
const { app, server, PORT, grantExpress } = buildServer();

app.use(grantExpress as express.RequestHandler);
app.use("/", userRoutes);
app.use("/pets", petRoutes);
app.use("/msgs", msgRoutes);
app.use(isLoggedIn, express.static("protect"));
app.use("/community", communityRoutes);

app.use(express.static("public"));
app.use(express.static("uploads"));
// //  404
// app.use((req, res) => {
//     res.redirect('404.html')
// })

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
