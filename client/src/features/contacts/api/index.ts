import { Get, Post, Patch, Delete, handleAPIResponse } from '@/lib/fetch';
import type {
  NewContact,
  ContactResponse,
  UpdateContactParams,
  AddLead,
} from '../types';

export const getDashboardContacts = (): Promise<ContactResponse> => {
  return Get({ endpoint: 'dashboard/contacts' }).then(
    handleAPIResponse<ContactResponse>
  );
};

export const getContacts = (): Promise<ContactResponse> => {
  return Get({ endpoint: `contacts${window.location.search}` }).then(
    handleAPIResponse<ContactResponse>
  );
};

export const getContact = (id: number): Promise<ContactResponse> => {
  return Get({ endpoint: `contacts/${id}` }).then(
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

export const searchContacts = ({
  addLead,
}: AddLead): Promise<ContactResponse> => {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');
  const params = addLead ? `?name=${name}` : window.location.search;

  return Get({ endpoint: `contacts/search${params}` }).then(
    handleAPIResponse<ContactResponse>
  );
};
