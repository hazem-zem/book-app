import { useCallback, useState } from 'react';
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
} from '../util/books';

export function useBooks(token) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadBooks = useCallback(
    async (search = '') => {
      setIsLoading(true);
      try {
        const data = await fetchBooks({ search, page });
        setBooks(data.data ?? []);
        setLastPage(data.last_page ?? 1);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  async function saveBook(id, payload) {
    if (id) {
      await updateBook(token, id, payload);
    } else {
      await createBook(token, payload);
    }
  }

  async function removeBook(id) {
    await deleteBook(token, id);
  }

  return {
    books,
    page,
    setPage,
    lastPage,
    isLoading,
    loadBooks,
    saveBook,
    removeBook,
  };
}