import express from "express";

const Router = express.Router();

Router.get("/", (req: any, res: any) => {
    return res.status(200).json({ message: "Users endpoint" });
});

export { Router };
module.exports = Router;
