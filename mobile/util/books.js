import axios from 'axios';

import { BACKEND_URL } from './auth';

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
}

export async function fetchBooks({ search = '', page = 1 }) {
  const response = await axios.get(`${BACKEND_URL}/books`, {
    params: { search, page },
  });

  return response.data;
}

export async function createBook(token, payload) {
  const response = await axios.post(`${BACKEND_URL}/books`, payload, {
    headers: authHeaders(token),
  });

  return response.data;
}

export async function updateBook(token, id, payload) {
  const response = await axios.put(`${BACKEND_URL}/books/${id}`, payload, {
    headers: authHeaders(token),
  });

  return response.data;
}

export async function deleteBook(token, id) {
  const response = await axios.delete(`${BACKEND_URL}/books/${id}`, {
    headers: authHeaders(token),
  });

  return response.data;
}
