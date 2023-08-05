import type { BaseResponse } from '@/types';

export type Contact = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export type Contacts = Array<Contact>;

export type NewContact = Omit<Contact, 'id'>;

export type ContactAsProp = {
  contact: Contact;
};

export interface ContactResponse extends BaseResponse {
  contacts: Contacts;
}
