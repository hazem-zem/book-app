import axios from 'axios';

import { BACKEND_URL } from './auth';

export async function createOrder(token, items) {
  const response = await axios.post(
    `${BACKEND_URL}/orders`,
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  );

  return response.data;
}
