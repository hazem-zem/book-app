import { useContext, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../components/ui/Button';
import { Colors } from '../constants/styles';
import { AuthContext } from '../store/auth-context';
import { CartContext } from '../store/cart-context';
import { createOrder } from '../util/orders';
import { formatApiError } from '../util/api-error';

function CartScreen() {
  const authCtx = useContext(AuthContext);
  const { lines, setQuantity, removeLine, clearCart } = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  async function completeOrder() {
    if (!lines.length) {
      Alert.alert('Cart empty', 'Add books from the catalog first.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder(
        authCtx.token,
        lines.map((line) => ({
          book_id: Number(line.bookId),
          quantity: Number(line.quantity),
        }))
      );
      clearCart();
      Alert.alert('Order placed', 'Thank you for your purchase.');
    } catch (error) {
      Alert.alert('Order failed', formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderLine({ item }) {
    return (
      <View style={styles.line}>
        <View style={styles.lineMain}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            ${item.price.toFixed(2)} each - max {item.stock}
          </Text>
        </View>
        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Qty</Text>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => setQuantity(item.bookId, item.quantity - 1)}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => setQuantity(item.bookId, item.quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
          <Pressable onPress={() => removeLine(item.bookId)}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        data={lines}
        keyExtractor={(item) => String(item.bookId)}
        renderItem={renderLine}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty.</Text>
        }
      />
      {lines.length > 0 ? (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <Button onPress={() => void completeOrder()}>
            {isSubmitting ? 'Placing order...' : 'Complete order'}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary100,
    padding: 16,
  },
  list: {
    flex: 1,
  },
  line: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  lineMain: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary800,
  },
  meta: {
    marginTop: 4,
    color: Colors.primary700,
    fontSize: 14,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyLabel: {
    color: Colors.primary700,
  },
  qtyBtn: {
    minWidth: 36,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.primary300,
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary800,
  },
  qtyValue: {
    minWidth: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.primary800,
  },
  remove: {
    color: Colors.error500,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    color: Colors.primary700,
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.primary300,
    paddingTop: 16,
    gap: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary800,
  },
});
