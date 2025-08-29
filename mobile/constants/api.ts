export const BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  CREATE: `${BASE_URL}/books`,
  GET_BOOKS: (query: any) =>
    `${BASE_URL}/books${query ? `?${new URLSearchParams(query)}` : ''}`,
};
