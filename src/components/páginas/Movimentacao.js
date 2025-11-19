import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Movimentacao() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movimentação</Text>
      <Text>Registros de movimentação do estoque.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
