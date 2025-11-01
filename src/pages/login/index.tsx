import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useState } from 'react';
import { Button } from '../../components/botoes';


export default function App() {
  const [isChecked, setIsChecked] = useState(false);
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
        <Text style={styles.titulo1}>
          Login
        </Text>

        <Text style={styles.paragrafo1}>
          Faça login com segurança em{'\n'}
          sua conta
        </Text>
      </View>

      <View style={styles.inputsContainer}>
        <TextInput
        style={styles.input1}
        placeholder="Digite seu E-mail"
        placeholderTextColor='#999'
        />

        <TextInput
        style={styles.input2}
        placeholder="Digite sua Senha"
        placeholderTextColor='#999'
        secureTextEntry
        />

        <View style={styles.checkboxLembre}>
          <TouchableOpacity
            style={[styles.checkbox, isChecked && styles.checkboxChecked]}
            onPress={() => setIsChecked(!isChecked)}>
            {isChecked && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            Lembrar-me
          </Text>
        </View>
      </View>

      <View style={styles.CadsContainer}>
        <View style={styles.buttonContainer}>
          <Button 
            title="Entrar" 
            onPress={() => {}} 
            type="primary"
          />
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
}

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

});