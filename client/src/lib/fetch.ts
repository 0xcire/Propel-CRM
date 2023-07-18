import { API_URL } from '@/config';

type FetchMethodOptions = {
  endpoint: string;
  body?: BodyInit | undefined;
};

export const Post = ({
  endpoint,
  body,
}: FetchMethodOptions): Promise<Response> => {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: body,
  });
};

export const Patch = ({
  endpoint,
  body,
}: FetchMethodOptions): Promise<Response> => {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: body,
  });
};

export const Get = ({ endpoint }: FetchMethodOptions): Promise<Response> => {
  return fetch(`${API_URL}/${endpoint}`);
};

export const Delete = ({
  endpoint,
  body,
}: FetchMethodOptions): Promise<Response> => {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: body,
  });
};
