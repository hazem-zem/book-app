import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
import { fetchBooks } from '../util/books';

function CustomerBooksScreen() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [cartItems, setCartItems] = useState({});

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0),
    [cartItems]
  );

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

  function runSearch() {
    setPage(1);
    setActiveSearch(search.trim());
  }

  function addToCart(bookId) {
    setCartItems((current) => ({
      ...current,
      [bookId]: (current[bookId] ?? 0) + 1,
    }));
  }

  function renderBookItem({ item }) {
    const quantityInCart = cartItems[item.id] ?? 0;

    return (
      <View style={styles.bookItem}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookMeta}>
          {item.author} - ${item.price} - Stock: {item.stock}
        </Text>
        <View style={styles.itemAction}>
          <Button onPress={() => addToCart(item.id)}>
            {quantityInCart > 0 ? `Add to Cart (${quantityInCart})` : 'Add to Cart'}
          </Button>
        </View>
      </View>
    );
  }

  if (isLoading && !books.length) {
    return <LoadingOverlay message="Loading books..." />;
  }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Books</Text>
      <Text style={styles.cartInfo}>Cart items: {cartCount}</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search title or author"
          style={styles.input}
        />
        <Button onPress={runSearch}>Search</Button>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
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

export default CustomerBooksScreen;

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
    marginBottom: 4,
  },
  cartInfo: {
    color: Colors.primary700,
    marginBottom: 12,
  },
  searchRow: {
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
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
  itemAction: {
    marginTop: 10,
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
});
