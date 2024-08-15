import { union } from "drizzle-orm/pg-core";
import { database } from "../../db/db";
import {
    contactsTable,
    contactUserBridgeTable,
    spamReportsTable,
    usersTable,
} from "../../db/schemas/schema";
import { and, eq, like, ne, or, sql } from "drizzle-orm";
import CustomError from "../../utils/customError";

export const getContactForSearchInUsersAndContacts = async (
    phoneNumber: number
) => {
    // Query usersTable
    const registeredContact = await database
        .select({
            name: usersTable.name,
            phoneNumber: usersTable.phoneNumber,
            email: usersTable.email,
            spamReportCount: sql<number>`COUNT(${spamReportsTable.reportedBy})`,
        })
        .from(usersTable)
        .leftJoin(
            spamReportsTable,
            eq(usersTable.phoneNumber, spamReportsTable.contactPhoneNumber)
        )
        .where(eq(usersTable.phoneNumber, phoneNumber))
        .groupBy(usersTable.phoneNumber, usersTable.name, usersTable.email);

    if (registeredContact.length > 0) {
        return registeredContact;
    }

    // Query contactsTable
    return await database
        .select({
            name: contactUserBridgeTable.name,
            phoneNumber: contactsTable.phoneNumber,
            spamReportCount: sql<number>`COUNT(${spamReportsTable.reportedBy})`,
        })
        .from(contactsTable)
        .leftJoin(
            contactUserBridgeTable,
            eq(
                contactsTable.phoneNumber,
                contactUserBridgeTable.contactPhoneNumber
            )
        )
        .leftJoin(
            spamReportsTable,
            eq(contactsTable.phoneNumber, spamReportsTable.contactPhoneNumber)
        )
        .where(eq(contactsTable.phoneNumber, phoneNumber))
        .groupBy(contactsTable.phoneNumber, contactUserBridgeTable.name);
};

// This function will return the contact details based on the name
export const getContactByNameInUsersAndContacts = async (name: string) => {
    // Query Contacts Table with Count
    const contactsResult = database
        .select({
            name: contactUserBridgeTable.name,
            phoneNumber: contactsTable.phoneNumber,
            spamReportCount: sql<number>`count(${spamReportsTable.reportedBy})`,
        })
        .from(contactsTable)
        .leftJoin(
            contactUserBridgeTable,
            eq(
                contactsTable.phoneNumber,
                contactUserBridgeTable.contactPhoneNumber
            )
        )
        .leftJoin(
            spamReportsTable,
            eq(contactsTable.phoneNumber, spamReportsTable.contactPhoneNumber)
        )
        .where(
            and(
                like(contactUserBridgeTable.name, `%${name}%`),
                sql`${contactUserBridgeTable.name} IS NOT NULL`
            )
        )
        .groupBy(contactsTable.phoneNumber, contactUserBridgeTable.name);

    // Query Users Table without Count
    const usersResult = database
        .select({
            name: usersTable.name,
            phoneNumber: usersTable.phoneNumber,
            spamReportCount: sql<number>`count(${spamReportsTable.reportedBy})`,
        })
        .from(usersTable)
        .leftJoin(
            spamReportsTable,
            eq(usersTable.phoneNumber, spamReportsTable.contactPhoneNumber)
        )
        .where(
            and(
                or(
                    like(usersTable.name, `%${name}%`),
                    eq(usersTable.name, name)
                )
            )
        )
        .groupBy(usersTable.phoneNumber, usersTable.name);

    // Combine Results
    const combinedResults = await union(contactsResult, usersResult as any);

    return combinedResults;
};

export const markSpam = async (
    phoneNumber: number,
    name: string | null,
    user: {
        userId: number;
        phoneNumber: string;
    }
) => {
    try {
        // Start transaction
        await database.transaction(async (trx) => {
            // Insert or ignore if already in the contact table
            await trx
                .insert(contactsTable)
                .values({ phoneNumber })
                .onConflictDoNothing();

            if (name) {
                await trx
                    .insert(contactUserBridgeTable)
                    .values({
                        userId: user.userId,
                        contactPhoneNumber: phoneNumber,
                        name,
                    })
                    .onConflictDoNothing();
            }

            await trx.insert(spamReportsTable).values({
                reportedBy: user.userId,
                contactPhoneNumber: phoneNumber,
            });
        });
    } catch (error) {
        if (error instanceof Error && "code" in error) {
            // PostgreSQL unique constraint violation error code is '23505'
            if (error.code === "23505") {
                throw new CustomError({
                    name: "ContactAlreadyMarkedAsSpam",
                    message: "Contact already marked as spam",
                    httpCode: 400,
                });
            }
        }
        // Rethrow if the error is not related to the unique constraint
        throw error;
    }
};
