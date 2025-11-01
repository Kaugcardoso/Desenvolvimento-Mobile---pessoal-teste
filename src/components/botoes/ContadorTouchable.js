import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

function ContadorTouchable() {
  const [valor, setValor] = useState(0);

  function incrementar() {
    if (valor < 10) {
      setValor(valor + 1);
    }
  }

  function decrementar() {
    if (valor > 0) {
      setValor(valor - 1);
    }
  }  
  // fica desabilitado quando atingir 10
  var desabilitado1 = valor >= 10;
  var desabilitado2 = valor <= 0;

  return (
    <View style={styles.caixa}>
      <Text style={styles.titulo}>Valor: {valor}</Text>

      <TouchableOpacity
        onPress={incrementar}
        disabled={desabilitado1}
        style={[styles.botao, desabilitado1  ? styles.botaoDesabilitado : null]}      >
        <Text style={styles.texto}>
          {desabilitado1 ? "Limite atingido" : "Incrementar"}
          
        </Text>        
      </TouchableOpacity>

      <TouchableOpacity
        onPress={decrementar}
        disabled={desabilitado2}
        style={[styles.botao, desabilitado2  ? styles.botaoDesabilitado : null]}      >
        <Text style={styles.texto}>
          {desabilitado2 ? "Limite atingido" : "Decrementar"}
          
        </Text>        
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { padding: 16, gap: 12 },
  titulo: { fontSize: 18, fontWeight: "600" },
  botao: { backgroundColor: "blue", padding: 12, borderRadius: 8 },
  botaoDesabilitado: { opacity: 0.5 },
  texto: { color: "white", textAlign: "center", fontSize: 16 }
});

export default ContadorTouchable;
