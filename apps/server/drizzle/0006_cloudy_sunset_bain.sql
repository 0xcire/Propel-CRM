CREATE TABLE IF NOT EXISTS "sold_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer,
	"user_id" integer,
	"sold_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sold_listings" ADD CONSTRAINT "sold_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sold_listings" ADD CONSTRAINT "sold_listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
