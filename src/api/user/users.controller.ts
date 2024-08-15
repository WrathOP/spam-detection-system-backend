import { database } from "../../db/db";
import { SelectUser, usersTable } from "../../db/schemas/schema";
import { eq, lt, gte, ne } from "drizzle-orm";

export const getUser = async (
    phone_number: number
): Promise<SelectUser | null> => {
    // Get user from database with phone number
    const user = await database
        .select()
        .from(usersTable)
        .where(eq(usersTable.phoneNumber, phone_number));

    return user.length > 0 ? user[0] : null;
};
