import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
}

export function Button({ title, onPress, type = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, type === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary]} 
      onPress={onPress}
    >
      <Text style={[styles.buttonText, type === 'secondary' ? styles.buttonTextSecondary : styles.buttonTextPrimary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonPrimary: {
    backgroundColor: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'inter',
    fontWeight: 'bold',
  },
  buttonTextPrimary: {
    color: '#0062C4',
  },
  buttonTextSecondary: {
    color: '#ffffff',
  },
});