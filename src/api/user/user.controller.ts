import { Request, Response, NextFunction } from "express";
import { getUser } from "./user.service";

export const getUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await getUser(parseInt(id));

        if (user) {
            return res.status(200).json({ user });
        } else {
            return res.status(204).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        next(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
