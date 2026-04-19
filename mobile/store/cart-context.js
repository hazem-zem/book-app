import { createContext, useCallback, useMemo, useState } from 'react';

export const CartContext = createContext({
  lines: [],
  itemCount: 0,
  addToCart: () => {},
  setQuantity: () => {},
  removeLine: () => {},
  clearCart: () => {},
});

function CartProvider({ children }) {
  const [lines, setLines] = useState([]);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const addToCart = useCallback((book) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.bookId === book.id);
      if (idx === -1) {
        return [
          ...prev,
          {
            bookId: book.id,
            title: book.title,
            author: book.author,
            price: Number(book.price),
            stock: Number(book.stock),
            quantity: 1,
          },
        ];
      }
      const line = prev[idx];
      if (line.quantity >= line.stock) {
        return prev;
      }
      const next = [...prev];
      next[idx] = { ...line, quantity: line.quantity + 1 };
      return next;
    });
  }, []);

  const setQuantity = useCallback((bookId, quantity) => {
    const qty = Math.max(0, Math.floor(Number(quantity)));
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.bookId === bookId);
      if (idx === -1) return prev;
      const line = prev[idx];
      if (qty <= 0) {
        return prev.filter((l) => l.bookId !== bookId);
      }
      const capped = Math.min(qty, line.stock);
      const next = [...prev];
      next[idx] = { ...line, quantity: capped };
      return next;
    });
  }, []);

  const removeLine = useCallback((bookId) => {
    setLines((prev) => prev.filter((l) => l.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [lines, itemCount, addToCart, setQuantity, removeLine, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
