import { Router } from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser, getUser } from "../api/user/users.service";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "./password_hashing";

import { Login, Signup } from "./auth.interface";

const authRouter = Router();

authRouter.post(
    "/login",
    async (req: Request<any, any, Login, any>, res: Response) => {
        try {
            const { phone_number, password } = req.body;

            if (!phone_number || !password) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Phone number and password are required",
                });
            }

            // Get user from database
            const user = await getUser(phone_number);

            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid credentials",
                });
            }

            // Verify password
            const isPasswordValid = await comparePassword(
                password,
                user.password
            );

            // If possword is not valid
            if (!isPasswordValid) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid credentials",
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, phoneNumber: user.phoneNumber },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            // Set token in HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600000, // 1 hour
            });

            return res.status(StatusCodes.OK).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    phone_number: user.phoneNumber,
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
            });
        }
    }
);

authRouter.post(
    "/signup",
    async (req: Request<any, any, Signup, any>, res: Response) => {
        try {
            const { name, password, phone_number, username, email } = req.body;
            if (!phone_number || !password || !name) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "name or phone number or password not sent",
                });
            }

            const user = await getUser(phone_number);
            if (user) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "User already exists" });
            }

            // Hash the password
            const hashedPassword = await hashPassword(password);

            // Create user with hashed password
            const createdUser = await createUser(
                name,
                phone_number,
                hashedPassword,
                username,
                email
            );

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: createdUser.id,
                    phoneNumber: createdUser.phone_number,
                },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            // Set token in HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "strict", // Protect against CSRF
                maxAge: 3600000, // 1 hour in milliseconds
            });

            return res.status(StatusCodes.CREATED).json({
                message: "User created successfully",
                user: {
                    id: createdUser.id,
                    name: createdUser.name,
                    phone_number: createdUser.phone_number,
                    username: createdUser.username,
                    email: createdUser.email,
                },
            });
        } catch (error) {
            console.error(error);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }
);

authRouter.post("/logout", (req: Request, res: Response) => {
    // Clear the token cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(StatusCodes.OK).json({
        message: "Logged out successfully",
    });
});

export { authRouter };
module.exports = authRouter;
