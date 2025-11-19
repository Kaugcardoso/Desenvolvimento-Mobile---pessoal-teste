import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import HeaderMobile from './layout/HeaderMobile';
import FooterMobile from './layout/FooterMobile';
import styles from '../styles/MobileStyles';
import HomePage from './páginas/HomePage';
import Dashboard from './pages/Dashboard';
import Produto from './pages/Produto';
import Estoque from './pages/Estoque';
import Fornecedor from './pages/Fornecedor';
import Movimentacao from './pages/Movimentacao';

const MENU_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'produto', label: 'Produto' },
  { key: 'estoque', label: 'Estoque' },
  { key: 'fornecedor', label: 'Fornecedor' },
  { key: 'movimentacao', label: 'Movimentação' },
];

const MobileApp = () => {
  const [selected, setSelected] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderContent = () => {
    switch (selected) {
      case 'dashboard':
        return <Dashboard />;
      case 'produto':
        return <Produto />;
      case 'estoque':
        return <Estoque />;
      case 'fornecedor':
        return <Fornecedor />;
      case 'movimentacao':
        return <Movimentacao />;
      default:
        return <HomePage />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderMobile title="Baita Estoque" onOpenMenu={() => setMenuOpen(true)} />

      <View style={styles.content}>{renderContent()}</View>

      <FooterMobile />

      <Modal visible={menuOpen} animationType="slide" transparent={true} onRequestClose={() => setMenuOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuPanel}>
                <ScrollView>
                  <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12, color: '#072b4b' }}>Menu</Text>
                  {MENU_ITEMS.map((item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => {
                        setSelected(item.key);
                        setMenuOpen(false);
                      }}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>{item.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MobileApp;
