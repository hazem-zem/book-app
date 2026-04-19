import { useContext } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';

function WelcomeScreen() {
  const authCtx = useContext(AuthContext);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text style={styles.tokenText}>Token saved in auth context.</Text>
      <Text numberOfLines={1} style={styles.tokenPreview}>
        {authCtx.token}
      </Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tokenText: {
    marginTop: 12,
  },
  tokenPreview: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
});
