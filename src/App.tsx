import React, { useState } from 'react';
import { View } from 'react-native';
import CompEstiloso from './styles/CompEstiloso';
import LoginPage from './pages/login';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <View style={{ flex: 1 }}>
        <LoginPage onLogin={() => { console.log('App: onLogin called'); setLoggedIn(true); }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CompEstiloso />
    </View>
  );
}