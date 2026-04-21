import { useState } from 'react';

const emptyForm = {
  title: '',
  author: '',
  price: '',
  stock: '',
};

export function useBookForm() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title ?? '',
      author: book.author ?? '',
      price: String(book.price ?? ''),
      stock: String(book.stock ?? ''),
    });
  }

  function getPayload() {
    return {
      title: form.title.trim(),
      author: form.author.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };
  }

  function reset() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return {
    form,
    editingId,
    update,
    startCreate,
    startEdit,
    getPayload,
    reset,
  };
}