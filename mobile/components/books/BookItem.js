import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/styles';

export default function BookItem({ item, onEdit, onDelete }) {
  return (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>

      <Text style={styles.bookMeta}>
        {item.author} - ${item.price} - Stock: {item.stock}
      </Text>

      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={[styles.actionText, styles.deleteText]}>
            Delete
          </Text>
        </TouchableOpacity>
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
});