import { Get, Post, Patch, Delete, handleAPIResponse } from '@/lib/fetch';
import type {
  NewContact,
  ContactResponse,
  UpdateContactParams,
} from '../types';

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
