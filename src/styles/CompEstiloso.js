import React, { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import Menu from '../components/Menu';
import HomePage from '../components/páginas/HomePage';
import AboutPage from '../components/páginas/AboutPage';
import ContactPage from '../components/páginas/ContactPage';
import Produto from '../components/pages/Produto';
import Estoque from '../components/pages/Estoque';
import Fornecedor from '../components/pages/Fornecedor';
import Movimentacao from '../components/pages/Movimentacao';

export default function CompEstiloso() {
  const [selected, setSelected] = useState('dashboard');

  const renderContent = () => {
    switch (selected) {
      case 'dashboard':
        return <HomePage />;
      case 'produto':
        return <Produto />;
      case 'estoque':
        return <Estoque />;
      case 'fornecedor':
        return <Fornecedor />;
      case 'movimentacao':
        return <Movimentacao />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  const titleMap = {
    dashboard: 'Dashboard',
    produto: 'Produto',
    estoque: 'Estoque',
    fornecedor: 'Fornecedor',
    movimentacao: 'Movimentação',
    about: 'About',
    contact: 'Contact',
  };

  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.container}>
        <Menu selected={selected} onSelect={setSelected} />

        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{titleMap[selected] || 'Baita Estoque'}</Text>
          </View>

          <View style={styles.content}>{renderContent()}</View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Baita Estoque — Todos os direitos reservados</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, flexDirection: 'row' },
  main: { flex: 1, backgroundColor: '#f0f0f0' },
  header: { height: 64, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0b3b60' },
  content: { flex: 1, padding: 16 },
  footer: { height: 52, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e6e6e6', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#666', fontSize: 12 },
});

