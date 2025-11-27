import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, useWindowDimensions, Platform, ImageBackground } from 'react-native';
import React from 'react';
import { useState } from 'react';
import { Button } from '../../components/botoes';

const styles = StyleSheet.create({
  // CONTAINER GERAL
  container: {
    flex: 1,
    backgroundColor: '#0062C4',
  },

  // TEXTOS 
  tituloContainer: {
    width: '100%',
    paddingHorizontal: 50,
    paddingTop: 100,  // menor espaçamento no topo
    marginBottom: 8, // aproxima o título dos inputs
  },

  titulo1: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'inter',
    alignSelf: 'flex-start', // Alinha o texto à esquerda
  },

  paragrafo1: {
    color: '#ffffff',
    fontSize: 15,
    marginTop: 10,
    fontFamily: 'inter',
    fontWeight: 'normal',
    alignSelf: 'flex-start', // Alinha o texto à esquerda
  },

  // CONTAINER DOS INPUTS
  inputsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 50,
    justifyContent: 'flex-start',
    paddingTop: 50,
  },

  // EMAIL
  input1: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  // SENHA 
  input2: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
  },

  // LOGO
  logoContainer: {
    width: '100%',
    alignItems: 'flex-start', // use 'center' para centralizar horizontalmente, 'flex-start' para esquerda
    marginBottom: -50,          // aproxima ainda mais do título/inputs
    paddingHorizontal: 50,
    marginTop: '30%',
  },

  logo: {
    width: 80,
    height: 80,
  },


  // LEMBRAR DE MIM
  checkboxLembre: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,

  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 10,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#ffffffff',
  },

  checkboxInner: {
    width: 0,
    height: 15,
    backgroundColor: '#ffffffff',
    borderRadius: 10,
  },

  checkboxLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'inter',
  },

  CadsContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: '40%',
  },

  // Botão de Login
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 50,
    marginTop: -100,
  },

  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },

  signupText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'inter',
  },

  linkText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'inter',
    textDecorationLine: 'underline',
  },

  signupLink: {
    fontWeight: 'bold',
  },

  /* Desktop styles */

  desktopWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0060C5',
  },

  sideImageLeft: {
    width: '33%',
    height: '100%',
  },

  sideImageRight: {
    width: '33%',
    height: '100%',
  },

  desktopCenterArea: {
    width: '34%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0060C5',
  },

  desktopCardBig: {
    width: 460,
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 38,
    alignItems: 'center',

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 14,
  },

  desktopLogoBig: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },

  desktopTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },

  desktopSubtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 20,
  },

  desktopLine: {
    width: '90%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },

  desktopInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  desktopButton: {
    marginTop: 10,
    backgroundColor: '#0060C5',
    width: '100%',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  desktopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  desktopFooterText: {
    marginTop: 25,
    fontSize: 12,
    color: '#777',
  },

  desktopBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  desktopCenterWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 72, 173, 0.90)',
  },
});

export default function LoginPage({ onLogin }: { onLogin?: () => void }) {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Preencha e-mail e senha');
      return;
    }
    // aqui podemos adicionar validação real / chamada API
    console.log('LoginPage: handleLogin called with', { email });
    onLogin && onLogin();
  };

  return (
    // choose desktop layout when running on web with wide screen
    (() => {
      const { width } = useWindowDimensions();
      const isDesktop = Platform.OS === 'web' && width >= 700;

      if (isDesktop) {
        return (
          <ImageBackground
            source={require('../../../assets/estoqueFundo.png')}
            style={styles.desktopBackground}
            resizeMode="cover"
          >
            {/* Azul translúcido */}
            <View style={styles.blueOverlay} />

            <View style={styles.desktopCenterWrapper}>
              <View style={styles.desktopCardBig}>

                <Image
                  source={require('../../../assets/logoEstoque.png')}
                  style={styles.desktopLogoBig}
                  resizeMode="contain"
                />

                <Text style={styles.desktopTitle}>Sistema De Estoque - JJK</Text>
                <Text style={styles.desktopSubtitle}>E-Commerce</Text>

                <View style={styles.desktopLine} />

                <TextInput
                  style={styles.desktopInput}
                  placeholder="Usuário"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                />

                <TextInput
                  style={styles.desktopInput}
                  placeholder="Senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity onPress={handleLogin} style={styles.desktopButton}>
                  <Text style={styles.desktopButtonText}>Entrar</Text>
                </TouchableOpacity>

                <Text style={styles.desktopFooterText}>© 2025 Baita Estoque</Text>
              </View>
            </View>
          </ImageBackground>
        );
      }

      // mobile / fallback layout (existing)
      return (
        <View style={styles.container}>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/2 1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.tituloContainer}>
            <Text style={styles.titulo1}>Login</Text>
            <Text style={styles.paragrafo1}>Faça login com segurança em{`\n`}sua conta</Text>
          </View>

          <View style={styles.inputsContainer}>
            <TextInput style={styles.input1} placeholder="Digite seu E-mail" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <TextInput style={styles.input2} placeholder="Digite sua Senha" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />

            <View style={styles.checkboxLembre}>
              <TouchableOpacity style={[styles.checkbox, isChecked && styles.checkboxChecked]} onPress={() => setIsChecked(!isChecked)}>
                {isChecked && <View style={styles.checkboxInner} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Lembrar-me</Text>
            </View>
          </View>

          <View style={styles.CadsContainer}>
            <View style={styles.buttonContainer}>
              <Button title="Entrar" onPress={handleLogin} type="primary" />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.linkText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não possui uma conta? </Text>
              <TouchableOpacity>
                <Text style={[styles.linkText, styles.signupLink]}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      );
    })()
  );
}