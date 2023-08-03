import { Get, Post, Patch, Delete, handleAPIResponse } from '@/lib/fetch';
import type { BaseResponse } from '@/types';

type Contact = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
};

type Contacts = Array<Contact>;

export type NewContact = Omit<Contact, 'id'>;

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
}: {
  id: number;
  data: NewContact;
}): Promise<ContactResponse> => {
  return Patch({ endpoint: `contacts/${id}`, body: JSON.stringify(data) }).then(
    handleAPIResponse<ContactResponse>
  );
};

export const deleteContact = ({
  id,
}: {
  id: number;
}): Promise<ContactResponse> => {
  return Delete({ endpoint: `contacts/${id}` }).then(
    handleAPIResponse<ContactResponse>
  );
};
