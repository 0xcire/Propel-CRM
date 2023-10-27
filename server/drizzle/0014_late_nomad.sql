ALTER TABLE "listings_to_contacts" DROP CONSTRAINT "listings_to_contacts_listing_id_listings_id_fk";
--> statement-breakpoint
ALTER TABLE "sold_listings" DROP CONSTRAINT "sold_listings_listing_id_listings_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings_to_contacts" ADD CONSTRAINT "listings_to_contacts_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sold_listings" ADD CONSTRAINT "sold_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
