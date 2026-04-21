import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import { CartContext } from '../store/cart-context';
import { useBooks } from '../hooks/useBooks';

import CustomerBookItem from '../components/books/CustomerBookItem';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import SearchBar from '../components/ui/SearchBar';

export default function CustomerBooksScreen() {
  const { addToCart } = useContext(CartContext);

  const {
    books,
    page,
    setPage,
    lastPage,
    isLoading,
    loadBooks,
  } = useBooks();

  const [input, setInput] = useState('');

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  function runSearch() {
    setPage(1);
    loadBooks(input.trim());
  }

  if (isLoading && !books.length) {
    return <LoadingOverlay message="Loading books..." />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Books</Text>

      <SearchBar
        value={input}
        onChangeText={setInput}
        onSearch={runSearch}
        placeholder="Search books..."
      />

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomerBookItem item={item} onAdd={addToCart} />
        )}
      />

      <Button onPress={() => setPage((p) => Math.max(1, p - 1))}>
        Prev
      </Button>

      <Text>
        Page {page} / {lastPage}
      </Text>

      <Button onPress={() => setPage((p) => Math.min(lastPage, p + 1))}>
        Next
      </Button>
    </View>
  );
}