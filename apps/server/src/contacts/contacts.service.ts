import { Contact, deleteContactByID, deleteUserContactRelation, findContactByDetails, findRelation, getContactRelations, getUserDashboardContacts, getUsersContacts, insertNewContact, insertNewRelation, NewContact, searchForContacts, updateContactByID } from "@propel/drizzle";
import { IContactsService } from "./contacts.interface";
import { Limit } from "@propel/types";
import { PropelHTTPError } from "../lib/http-error";

export class ContactsService implements IContactsService {
    async getDashboardContacts(userId: number): Promise<Array<Contact | null>> { // TODO: hmm - return type - look at query
        return await getUserDashboardContacts(userId)
    }

    // ?
    async searchContacts(name: string, userId: number, page?: string, limit?: string): Promise<Omit<Contact, 'createdAt'>[]> {
        let contacts: Omit<Contact, 'createdAt'>[] = [];
        
        // react query query does not run if name is ''
        if (name && name === "") {
            contacts = [];
        }
    
        if (name) {
            contacts = await searchForContacts({
            userID: userId,
            name: name as string,
            limit: limit ? (limit as Limit) : "10",
            // page: page ? +page : 1,
            page: +(page ?? "1"),
          });
        }

        return contacts
    }

    async getAllContacts(userId: number, page?: string, limit?: string): Promise<Array<Contact | null>> {
        return await getUsersContacts(userId, +(page ?? "1"), limit as Limit);
    }

    async createContact(userId: number, { name, phoneNumber, email, address }: NewContact): Promise<{contact: NewContact, message: string }> {
        const contact: NewContact = {
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            address: address,
        };
    
        let insertedContact: NewContact | undefined = undefined;
        let contactID;
    
        const existingContact = await findContactByDetails(contact);
    
        if (!existingContact) {
          insertedContact = await insertNewContact(contact);
          contactID = insertedContact?.id;
        }
    
        if (existingContact) {
          contactID = existingContact.id;
          const establishedRelation = await findRelation({ currentUserID: userId, existingContactID: contactID });
          if (establishedRelation) {
            throw new PropelHTTPError({
              code: "CONFLICT",
              message: "Contact already exists in your network.",
            });
          }
        }
    
        await insertNewRelation({ currentUserID: userId, newContactID: contactID as number });

        return { 
            message: `Added ${insertedContact ? insertedContact.name : existingContact?.name} to your network.`,
            contact: contact,
        }
    }

    async updateContact(contactId: string, fields: Partial<Contact>): Promise<NewContact | undefined> {
        return await updateContactByID({ contactID: +contactId, inputs: fields });
    }

    async deleteContact(userId: number, contactId: string): Promise<void> {
        const relations = await getContactRelations(+contactId);
        
        if (relations.length === 1) {
          await deleteUserContactRelation({ userID: userId, contactID: +contactId });
    
          await deleteContactByID(+contactId);
        } else {
          await deleteUserContactRelation({ userID: userId, contactID: +contactId });
        }
    }
}