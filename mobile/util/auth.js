import axios from 'axios';

export const BACKEND_URL = 'http://127.0.0.1:8000/api';

async function authenticate(mode, payload) {
  const url = `${BACKEND_URL}/${mode}`;

  const response = await axios.post(url, payload);

  return {
    token: response.data.token,
    user: response.data.user,
  };
}

export function createUser(name, email, password) {
  return authenticate('register', { name, email, password });
}

export function login(email, password) {
  return authenticate('login', { email, password });
}