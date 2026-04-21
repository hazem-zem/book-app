import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AdminBooksScreen from './screens/AdminBooksScreen';
import CustomerBooksScreen from './screens/CustomerBooksScreen';
import CartScreen from './screens/CartScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import CartProvider from './store/cart-context';
import IconButton from './components/ui/IconButton';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  const defaultScreenName = authCtx.isAdmin ? 'AdminBooks' : 'CustomerBooks';

  return (
    <Stack.Navigator
      initialRouteName={defaultScreenName}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="exit"
            color={tintColor}
            size={24}
            onPress={authCtx.logout}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen
        name="AdminBooks"
        component={AdminBooksScreen}
        options={{ title: 'Books Admin' }}
      />
      <Stack.Screen
        name="CustomerBooks"
        component={CustomerBooksScreen}
        options={({ navigation }) => ({
          title: 'Books',
          headerRight: ({ tintColor }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton
                icon="cart-outline"
                color={tintColor}
                size={24}
                onPress={() => navigation.navigate('Cart')}
              />
              <IconButton
                icon="exit"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({ navigation }) => ({
          title: 'Cart',
          headerLeft: ({ tintColor }) =>
            navigation.canGoBack() ? (
              <IconButton
                icon="arrow-back"
                color={tintColor}
                size={24}
                onPress={() => navigation.goBack()}
              />
            ) : null,
        })}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && (
        <CartProvider>
          <AuthenticatedStack />
        </CartProvider>
      )}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const { authenticate } = useContext(AuthContext);

  useEffect(() => {
    let isActive = true;

    async function fetchAuthData() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && isActive) {
        authenticate(storedToken, storedUser ? JSON.parse(storedUser) : null);
      }

      if (isActive) {
        setIsTryingLogin(false);
      }
    }

    fetchAuthData();

    return () => {
      isActive = false;
    };
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
