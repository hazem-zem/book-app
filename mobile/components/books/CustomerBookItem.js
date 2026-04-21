import { View, Text, StyleSheet } from 'react-native';
import Button from '../ui/Button';
import { Colors } from '../../constants/styles';

export default function CustomerBookItem({ item, onAdd }) {
  return (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>

      <Text style={styles.bookMeta}>
        {item.author} - ${item.price} - Stock: {item.stock}
      </Text>

      <View style={styles.itemAction}>
        <Button onPress={() => onAdd(item)}>Add to Cart</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});