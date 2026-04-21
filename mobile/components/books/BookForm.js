import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../ui/Button';
import { Colors } from '../../constants/styles';

export default function BookForm({
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
  isSaving,
}) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {editingId ? 'Edit book' : 'Create new book'}
      </Text>

      <TextInput
        value={form.title}
        onChangeText={(v) => onChange('title', v)}
        placeholder="Title"
        style={styles.input}
      />

      <TextInput
        value={form.author}
        onChangeText={(v) => onChange('author', v)}
        placeholder="Author"
        style={styles.input}
      />

      <TextInput
        value={form.price}
        onChangeText={(v) => onChange('price', v)}
        placeholder="Price"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        value={form.stock}
        onChangeText={(v) => onChange('stock', v)}
        placeholder="Stock"
        keyboardType="number-pad"
        style={styles.input}
      />

      <Button onPress={onSubmit}>
        {isSaving ? 'Saving...' : 'Save'}
      </Button>

      {editingId && <Button onPress={onCancel}>Cancel</Button>}
    </View>
  );
}

const styles = StyleSheet.create({
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
});