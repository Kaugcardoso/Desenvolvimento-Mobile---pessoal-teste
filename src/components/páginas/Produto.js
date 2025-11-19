import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Produto() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produto</Text>
      <Text>Aqui você verá a lista de produtos e detalhes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
