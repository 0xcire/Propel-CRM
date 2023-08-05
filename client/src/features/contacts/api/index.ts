import { Get, Post, Patch, Delete, handleAPIResponse } from '@/lib/fetch';
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

export type UpdateContactParams = {
  id: number;
  data: Partial<NewContact>;
};

export interface ContactResponse extends BaseResponse {
  contacts: Contacts;
}

export const getContacts = (): Promise<ContactResponse> => {
  return Get({ endpoint: 'contacts' }).then(handleAPIResponse<ContactResponse>);
};

export const createContact = (data: NewContact): Promise<ContactResponse> => {
  return Post({ endpoint: 'contacts', body: JSON.stringify(data) }).then(
    handleAPIResponse<ContactResponse>
  );
};

export const updateContact = ({
  id,
  data,
}: UpdateContactParams): Promise<ContactResponse> => {
  return Patch({ endpoint: `contacts/${id}`, body: JSON.stringify(data) }).then(
    handleAPIResponse<ContactResponse>
  );
};

export const deleteContact = (id: number): Promise<ContactResponse> => {
  return Delete({ endpoint: `contacts/${id}` }).then(
    handleAPIResponse<ContactResponse>
  );
};
