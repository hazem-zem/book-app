import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
import { AuthContext } from '../store/auth-context';
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
} from '../util/books';
import { formatApiError } from '../util/api-error';

const emptyForm = {
  title: '',
  author: '',
  price: '',
  stock: '',
};

function AdminBooksScreen() {
  const authCtx = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingBookId, setEditingBookId] = useState(null);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchBooks({ search: activeSearch, page });
      setBooks(data.data ?? []);
      setLastPage(data.last_page ?? 1);
    } catch (error) {
      Alert.alert('Load failed', 'Could not fetch books.');
    } finally {
      setIsLoading(false);
    }
  }, [activeSearch, page]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  function updateFormValue(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startCreate() {
    setEditingBookId(null);
    setForm(emptyForm);
  }

  function startEdit(book) {
    setEditingBookId(book.id);
    setForm({
      title: book.title ?? '',
      author: book.author ?? '',
      price: String(book.price ?? ''),
      stock: String(book.stock ?? ''),
    });
  }

  async function submitForm() {
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (
      !payload.title ||
      !payload.author ||
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.stock)
    ) {
      Alert.alert('Invalid input', 'Please fill title, author, price and stock.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingBookId) {
        await updateBook(authCtx.token, editingBookId, payload);
      } else {
        await createBook(authCtx.token, payload);
      }
      setForm(emptyForm);
      setEditingBookId(null);
      await loadBooks();
    } catch (error) {
      Alert.alert('Save failed', 'Book could not be saved.');
    } finally {
      setIsSaving(false);
    }
  }

  async function removeBook(id) {
    try {
      await deleteBook(authCtx.token, id);
      await loadBooks();
    } catch (error) {
      Alert.alert('Delete failed', formatApiError(error));
    }
  }

  function confirmDelete(id) {
    Alert.alert(
      'Delete book?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimeout(() => {
              void removeBook(id);
            }, 0);
          },
        },
      ],
      { cancelable: true }
    );
  }

  function runSearch() {
    setPage(1);
    setActiveSearch(search.trim());
  }

  function renderBookItem({ item }) {
    return (
      <View style={styles.bookItem}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookMeta}>
          {item.author} - ${item.price} - Stock: {item.stock}
        </Text>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => startEdit(item)} hitSlop={12}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmDelete(item.id)}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading && !books.length) {
    return <LoadingOverlay message="Loading books..." />;
  }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Admin Books</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search title or author"
          style={styles.input}
        />
        <Button onPress={runSearch}>Search</Button>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingBookId ? 'Edit book' : 'Create new book'}
        </Text>
        <TextInput
          value={form.title}
          onChangeText={(value) => updateFormValue('title', value)}
          placeholder="Title"
          style={styles.input}
        />
        <TextInput
          value={form.author}
          onChangeText={(value) => updateFormValue('author', value)}
          placeholder="Author"
          style={styles.input}
        />
        <TextInput
          value={form.price}
          onChangeText={(value) => updateFormValue('price', value)}
          placeholder="Price"
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <TextInput
          value={form.stock}
          onChangeText={(value) => updateFormValue('stock', value)}
          placeholder="Stock"
          keyboardType="number-pad"
          style={styles.input}
        />
        <View style={styles.formActions}>
          <Button onPress={submitForm}>{isSaving ? 'Saving...' : 'Save'}</Button>
          {editingBookId ? <Button onPress={startCreate}>Cancel Edit</Button> : null}
        </View>
      </View>

      <FlatList
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        data={books}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderBookItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No books found.</Text>}
      />

      <View style={styles.pagination}>
        <Button onPress={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
        <Text style={styles.pageText}>
          Page {page} / {lastPage}
        </Text>
        <Button onPress={() => setPage((p) => Math.min(lastPage, p + 1))}>
          Next
        </Button>
      </View>
    </View>
  );
}

export default AdminBooksScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.primary100,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary800,
    marginBottom: 12,
  },
  searchRow: {
    gap: 8,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: Colors.primary300,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary800,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  formActions: {
    gap: 8,
  },
  bookItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary800,
  },
  bookMeta: {
    marginTop: 4,
    color: Colors.primary700,
  },
  itemActions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 16,
  },
  actionText: {
    color: Colors.primary500,
    fontWeight: 'bold',
  },
  deleteText: {
    color: Colors.error500,
  },
  pagination: {
    marginTop: 12,
    gap: 8,
  },
  pageText: {
    textAlign: 'center',
    color: Colors.primary800,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: Colors.primary700,
  },
  list: {
    flex: 1,
  },
});
