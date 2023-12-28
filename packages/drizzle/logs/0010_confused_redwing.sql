DO $$ BEGIN
 CREATE TYPE "previous_status" AS ENUM('todo', 'in progress', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "previous_status" "previous_status";