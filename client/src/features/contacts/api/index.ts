import { Get, Post, Patch, Delete, handleAPIResponse } from '@/lib/fetch';
import type {
  NewContact,
  ContactResponse,
  UpdateContactParams,
} from '../types';

export const getDashboardContacts = (): Promise<ContactResponse> => {
  return Get({ endpoint: 'dashboard/contacts' }).then(
    handleAPIResponse<ContactResponse>
  );
};

export const getContacts = (): Promise<ContactResponse> => {
  // pagination etc
  return Get({ endpoint: `contacts` }).then(handleAPIResponse<ContactResponse>);
};

// shared extract?
export const searchContacts = (): Promise<ContactResponse> => {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');
  return Get({ endpoint: `search_contacts/?name=${name}` }).then(
    handleAPIResponse<ContactResponse>
  );
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
