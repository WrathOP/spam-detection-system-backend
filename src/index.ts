/// Project is abandoned and will be making this in django instead
/// Back to the basics

import express from "express";
import logger from "morgan";
import { config } from "dotenv";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("combined"));

app.use("/api/v1", require("./api"));

app.use("/auth", require("./auth"));
app.use("/", (req, res) => {
    console.log("Request made to ", req.url);
    res.send("Please use the /api/v1 endpoint");
});

// I always do personal projects on 3001
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
