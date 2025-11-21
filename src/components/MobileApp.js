import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';
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
  
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateX = useRef(new Animated.Value(-320)).current;

  useEffect(() => {
    if (menuOpen) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(panelTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(panelTranslateX, {
          toValue: -320,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuOpen, overlayOpacity, panelTranslateX]);

  const animatedOverlayStyle = {
    opacity: overlayOpacity,
  };

  const animatedPanelStyle = {
    transform: [{ translateX: panelTranslateX }],
  };

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
    <View style={{ flex: 1, position: 'relative' }}>
      <HeaderMobile title="Baita Estoque" onToggleMenu={() => setMenuOpen(!menuOpen)} />

      <View style={styles.content}>{renderContent()}</View>

      <FooterMobile />

      {/* Menu overlay com fade in/out - SEMPRE RENDERIZADO */}
      <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1, pointerEvents: menuOpen ? 'auto' : 'none' }, animatedOverlayStyle]} />
      </TouchableWithoutFeedback>

      {/* Menu deslizando para esquerda - SEMPRE RENDERIZADO */}
      <Animated.View style={[styles.menuPanelContainer, animatedPanelStyle, { pointerEvents: menuOpen ? 'auto' : 'none' }]}>
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
      </Animated.View>
    </View>
  );
};

export default MobileApp;
