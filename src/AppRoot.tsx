import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import CompEstiloso from './styles/CompEstiloso';
import MobileApp from './components/MobileApp';

const AppRoot = () => {
  const { width } = Dimensions.get('window');
  const isMobile = Platform.OS !== 'web' || width < 700;

  return <View style={{ flex: 1 }}>{isMobile ? <MobileApp /> : <CompEstiloso />}</View>;
};

export default AppRoot;
