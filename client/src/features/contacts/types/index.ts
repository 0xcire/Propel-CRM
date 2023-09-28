import type { BaseResponse } from '@/types';

export type Contact = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: Date;
};

export type Contacts = Array<Contact>;

export type NewContact = Omit<Contact, 'id' | 'createdAt'>;

export type ContactAsProp = {
  contact: Contact;
};

export interface ContactResponse extends BaseResponse {
  contacts: Contacts;
}

export type UpdateContactParams = {
  id: number;
  data: Partial<NewContact>;
};

export type ContactContext = {
  previousContacts: Contacts | undefined;
};
