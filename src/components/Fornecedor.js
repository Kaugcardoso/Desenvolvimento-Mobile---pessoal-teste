import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Fornecedor() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fornecedor</Text>
      <Text>Lista de fornecedores e detalhes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
