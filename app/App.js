import React from 'react';
import { StyleSheet } from 'react-native';

import { AuthContextProvider } from './components/auth_context.js';
import RootNavigator from './components/root_navigator.js';

export default function App() {

  return (
    <AuthContextProvider>

      <RootNavigator/>

    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
