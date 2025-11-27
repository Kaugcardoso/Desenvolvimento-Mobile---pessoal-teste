import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import styles from '../../styles/MobileStyles';

const HeaderMobile = ({ title = 'Baita Estoque', onToggleMenu }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={onToggleMenu} 
        style={styles.hamburger}
        activeOpacity={0.7}
        accessibilityLabel="Abrir menu"
        accessibilityRole="button"
      >
        <View style={styles.hamburgerContainer}>
          <View style={styles.hamburgerLines} />
          <View style={styles.hamburgerLines} />
          <View style={styles.hamburgerLines} />
        </View>
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

export default HeaderMobile;