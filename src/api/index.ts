import express from "express";

const Router = express.Router();

Router.use("/user", require("./user"));

Router.get("/healthCheck", (req: any, res: any) => {
    return res.status(200).json({ message: "Server is running" });
});

export { Router };
module.exports = Router;
