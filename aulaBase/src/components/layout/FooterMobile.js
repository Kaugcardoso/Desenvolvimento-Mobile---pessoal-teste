import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/MobileStyles';

const FooterMobile = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerText}>© {currentYear} Baita Estoque</Text>
        <Text style={styles.footerSubText}>Sistema de Controle de Estoque</Text>
      </View>
    </View>
  );
};

export default FooterMobile;