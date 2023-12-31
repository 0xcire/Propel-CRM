ALTER TABLE "contacts" ALTER COLUMN "address" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_to_contacts" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();