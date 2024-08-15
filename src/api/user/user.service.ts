import { database } from "../../db/db";
import { usersTable } from "../../db/schemas/schema";
import { eq, lt, gte, ne } from "drizzle-orm";

export const getUserByPhoneNumber = async (
    phone_number: number
): Promise<any> => {
    // Get user from database with phone number
    const user = await database
        .select({
            id: usersTable.id,
            name: usersTable.name,
            username: usersTable.username,
            phoneNumber: usersTable.phoneNumber,
            email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.phoneNumber, phone_number));

    return user.length > 0 ? user[0] : null;
};

export const getUser = async (id: number): Promise<any> => {
    // Get user from database with id
    const user = await database
        .select({
            id: usersTable.id,
            name: usersTable.name,
            username: usersTable.username,
            phoneNumber: usersTable.phoneNumber,
            email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));

    return user.length > 0 ? user[0] : null;
};

export const createUser = async (
    name: string,
    phone_number: number,
    password: string,
    username: string | null,
    email: string | null
): Promise<any> => {
    // Create user
    const user = await database
        .insert(usersTable)
        .values({
            name: name,
            username: username,
            phoneNumber: phone_number,
            password: password,
            email: email,
        })
        .returning({
            name: usersTable.name,
            username: usersTable.username,
            phoneNumber: usersTable.phoneNumber,
            email: usersTable.email,
        });

    return user;
};
