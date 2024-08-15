ALTER TABLE "users_table" DROP CONSTRAINT "users_table_username_unique";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "password" text NOT NULL;