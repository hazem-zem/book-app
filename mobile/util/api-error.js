export function formatApiError(error) {
  const data = error.response?.data;
  if (data) {
    if (typeof data.message === 'string') {
      return data.message;
    }
    if (data.message && typeof data.message === 'object') {
      return JSON.stringify(data.message);
    }
    if (data.errors && typeof data.errors === 'object') {
      const parts = Object.values(data.errors).flat();
      return parts.join('\n');
    }
  }
  if (error.message) {
    return error.message;
  }
  return 'Something went wrong.';
}
