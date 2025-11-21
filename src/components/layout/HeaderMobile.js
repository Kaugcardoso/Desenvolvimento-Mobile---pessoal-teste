import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../../styles/MobileStyles';

const HeaderMobile = ({ title = 'Baita Estoque', onToggleMenu }) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onToggleMenu} style={styles.hamburger} accessibilityLabel="Abrir menu">
        <View style={styles.hamburgerLines} />
        <View style={styles.hamburgerLines} />
        <View style={styles.hamburgerLines} />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default HeaderMobile;
