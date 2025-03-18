ALTER TABLE "user_to_contacts" DROP CONSTRAINT "user_to_contacts_contact_id_contacts_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_contacts" ADD CONSTRAINT "user_to_contacts_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
