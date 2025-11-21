import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Estoque() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque</Text>
      <Text>Informações de estoque aparecerão aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
