CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"address" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_contacts" (
	"user_id" integer NOT NULL,
	"contact_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_to_contacts" ADD CONSTRAINT "user_to_contacts_user_id_contact_id" PRIMARY KEY("user_id","contact_id");
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_contacts" ADD CONSTRAINT "user_to_contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_contacts" ADD CONSTRAINT "user_to_contacts_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
