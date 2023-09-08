import type { BaseResponse } from '@/types';

// TODO: fix. no createdAt field
export type Contact = {
  id?: number;
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

export type UpdateContactParams = {
  id: number;
  data: NewContact;
};
