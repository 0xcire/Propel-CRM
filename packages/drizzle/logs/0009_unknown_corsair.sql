ALTER TYPE "status" ADD VALUE 'completed';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'todo';--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "completed";