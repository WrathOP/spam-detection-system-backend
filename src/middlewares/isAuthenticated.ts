import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        phoneNumber: string;
    };
}

export const isAuthenticated = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Authentication required",
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Server JWT secret is not set",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
            phoneNumber: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error authenticating user", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Authentication required \n" + error,
        });
    }
};
