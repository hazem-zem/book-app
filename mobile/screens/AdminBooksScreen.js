import { useContext, useEffect, useState } from 'react';
import { StyleSheet,View, Text, FlatList, Alert } from 'react-native';

import { AuthContext } from '../store/auth-context';
import { useBooks } from '../hooks/useBooks';
import { useBookForm } from '../hooks/useBookForm';

import BookItem from '../components/books/BookItem';
import BookForm from '../components/books/BookForm';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import { Colors } from '../constants/styles';
export default function AdminBooksScreen() {
  const { token } = useContext(AuthContext);

  const {
    books,
    page,
    setPage,
    lastPage,
    isLoading,
    loadBooks,
    saveBook,
    removeBook,
  } = useBooks(token);

  const {
    form,
    editingId,
    update,
    startCreate,
    startEdit,
    getPayload,
    reset,
  } = useBookForm();

  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBooks(activeSearch);
  }, [loadBooks, activeSearch,books]);

  async function handleSubmit() {
    const payload = getPayload();

    if (!payload.title || !payload.author) {
      Alert.alert('Invalid input');
      return;
    }

    setIsSaving(true);
    try {
      await saveBook(editingId, payload);
      reset();
      loadBooks(activeSearch);
    } catch {
      Alert.alert('Save failed');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Admin Books</Text>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onSearch={() => setActiveSearch(search)}
        placeholder="Search books..."
      />

      <BookForm
        form={form}
        editingId={editingId}
        onChange={update}
        onSubmit={handleSubmit}
        onCancel={startCreate}
        isSaving={isSaving}
      />

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BookItem
            item={item}
            onEdit={startEdit}
            onDelete={removeBook}
          />
        )}
      />
    </View>
  );
}