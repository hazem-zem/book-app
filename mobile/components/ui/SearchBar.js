import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/styles';

export default function SearchBar({ value, onChangeText, onSearch, placeholder = 'Search' }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.primary700}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.primary300,
    color: Colors.primary800,
  },
});
