import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useState } from 'react';

export const AuthContext = createContext({
  token: '',
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  authenticate: (token, user) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authUser, setAuthUser] = useState(null);

  function authenticate(token, user) {
    setAuthToken(token);
    setAuthUser(user ?? null);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('user', JSON.stringify(user ?? null));
  }

  function logout() {
    setAuthToken(null);
    setAuthUser(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
  }

  const value = {
    token: authToken,
    user: authUser,
    isAdmin: authUser?.role === 'admin',
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
