import express from "express";
import logger from "morgan";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middlewares/isAuthenticated";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("combined"));

app.use("/auth", require("./auth"));

// Middleware added to the api/v1 to check if user is authenticated
app.use("/api/v1", isAuthenticated, require("./api"));

app.use("/", (req, res) => {
    console.log("Request made to ", req.url);
    res.send("Please use the /api/v1 endpoint");
});

// I always do personal projects on 3001
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
