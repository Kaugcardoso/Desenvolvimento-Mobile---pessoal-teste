import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/MobileStyles';

const FooterMobile = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2025 Baita Estoque</Text>
    </View>
  );
};

export default FooterMobile;
