import { Request, Response, NextFunction } from "express";
import {
    getContactForSearchInUsersAndContacts,
    getContactByNameInUsersAndContacts,
    markSpam,
} from "./contact.service";
import { searchContact } from "./contact.interface";
import { AuthRequest } from "../../middlewares/isAuthenticated";
import CustomError from "../../utils/customError";

export const getContactController = async (
    req: Request<any, any, any, searchContact>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { phoneNumber, name } = req.query;

        if (!phoneNumber && !name) {
            return res.status(400).json({
                message: "phone number or name is required for searching",
            });
        }

        // This could be handled but for the sake of simplicity, we will not handle it
        if (phoneNumber && name) {
            return res.status(400).json({
                message: "phone number and name cannot be used together",
            });
        }

        let contact;
        // If phone number is provided, search by phone number
        if (phoneNumber) {
            contact = await getContactForSearchInUsersAndContacts(phoneNumber);
        }

        // If name is provided, search by name
        if (name) {
            contact = await getContactByNameInUsersAndContacts(name);
        }

        if (contact && contact.length > 0) {
            return res.status(200).json(contact);
        } else {
            return res.status(204).json({ message: "Contact not found" });
        }
    } catch (error) {
        console.log(error);
        next(error);
        return res
            .status(500)
            .json({ message: "Internal server error" + error });
    }
};

export const markSpamController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { phoneNumber, addToContact = false, name } = req.body;
        const user = req.user;

        if (!phoneNumber) {
            return res.status(400).json({
                message: "phone number is required for marking as spam",
            });
        }

        // Handle the spam report and contact insertion in a transaction
        await markSpam(phoneNumber, name, user!);

        return res.status(200).json({ message: "Contact marked as spam" });
    } catch (error) {
        next(error);
        if (error instanceof CustomError) {
            res.status(error.httpCode).json({ message: error.message });
        } else {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
