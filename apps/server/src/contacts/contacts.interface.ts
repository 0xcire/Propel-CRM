import type { Contact, NewContact } from "@propel/drizzle"

export interface IContactsService {
    getDashboardContacts(userId: number): Promise<Array<Contact | null>>
    searchContacts(name: string, userId: number, page?: string, limit?: string): Promise<Omit<Contact, 'createdAt'>[]>
    getAllContacts(userId: number, page?: string, limit?: string): Promise<Array<Contact | null>> // TODO: all above endpoints should really be a part of this one
    createContact(userId: number, contact: NewContact): Promise<{contact: NewContact, message: string }>
    updateContact(contactId: string, fields: Partial<Contact>): Promise<NewContact | undefined>
    deleteContact(userId: number, contactId: string): Promise<void>
}