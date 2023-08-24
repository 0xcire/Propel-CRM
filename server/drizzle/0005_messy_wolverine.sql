CREATE TABLE IF NOT EXISTS "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"address" varchar(255) NOT NULL,
	"property_type" varchar(255) NOT NULL,
	"price" numeric(11, 2) NOT NULL,
	"bedrooms" integer NOT NULL,
	"baths" integer NOT NULL,
	"sq_ft" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listings_to_contacts" (
	"listing_id" integer NOT NULL,
	"contact_id" integer NOT NULL,
	CONSTRAINT listings_to_contacts_listing_id_contact_id PRIMARY KEY("listing_id","contact_id")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "session_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_admin" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "listing_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings_to_contacts" ADD CONSTRAINT "listings_to_contacts_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings_to_contacts" ADD CONSTRAINT "listings_to_contacts_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
