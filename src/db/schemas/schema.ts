import {
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
    id: serial("id").primaryKey(),
    username: text("username"),
    password: text("password").notNull(),
    name: text("name").notNull(),
    phoneNumber: integer("phone_number").notNull().unique(),
    email: text("email"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const contactsTable = pgTable("contacts_table", {
    phoneNumber: integer("phone_number").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const contactUserBridgeTable = pgTable("contact_user_bridge", {
    userId: integer("user_id")
        .references(() => usersTable.id)
        .notNull(),
    contactPhoneNumber: integer("contact_phone_number")
        .references(() => contactsTable.phoneNumber)
        .notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const spamReportsTable = pgTable(
    "spam_reports",
    {
        reportId: serial("report_id").primaryKey(),
        reportedBy: integer("reported_by")
            .references(() => usersTable.id)
            .notNull(),
        contactPhoneNumber: integer("contact_phone_number")
            .references(() => contactsTable.phoneNumber)
            .notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => ({
        unq: unique().on(t.contactPhoneNumber, t.reportedBy),
    })
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertContact = typeof contactsTable.$inferInsert;
export type SelectContact = typeof contactsTable.$inferSelect;

export type InsertContactUserBridge =
    typeof contactUserBridgeTable.$inferInsert;
export type SelectContactUserBridge =
    typeof contactUserBridgeTable.$inferSelect;

export type InsertSpamReport = typeof spamReportsTable.$inferInsert;
export type SelectSpamReport = typeof spamReportsTable.$inferSelect;
