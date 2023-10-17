ALTER TABLE "sold_listings" ADD COLUMN "contact_id" integer;--> statement-breakpoint
ALTER TABLE "sold_listings" ADD COLUMN "sale_price" numeric(11, 2) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sold_listings" ADD CONSTRAINT "sold_listings_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
