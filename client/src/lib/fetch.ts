import { API_URL } from '@/config';

type FetchMethodOptions = {
  endpoint: string;
  body?: BodyInit | undefined;
};

export const handleAPIResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw {
      message: data.message,
      status: response.status,
    };
  }
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
