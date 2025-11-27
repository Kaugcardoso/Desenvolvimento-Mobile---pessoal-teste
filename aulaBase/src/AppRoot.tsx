import React, { useState } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import CompEstiloso from './styles/CompEstiloso';
import MobileApp from './components/MobileApp';
import LoginPage from './pages/login';

const AppRoot = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { width } = Dimensions.get('window');
  const isMobile = Platform.OS !== 'web' || width < 700;

  if (!loggedIn) {
    return (
      <View style={{ flex: 1 }}>
        <LoginPage onLogin={() => setLoggedIn(true)} />
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{isMobile ? <MobileApp /> : <CompEstiloso />}</View>;
};

export default AppRoot;
