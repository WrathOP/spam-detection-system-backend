import express from "express";

const Router = express.Router();

Router.use("/user", require("./user"));
Router.use("/contact", require("./contact"));   

Router.get("/healthCheck", (req: any, res: any) => {
    return res.status(200).json({ message: "Server is running" });
});

module.exports = Router;
