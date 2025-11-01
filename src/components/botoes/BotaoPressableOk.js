import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

function estiloPorEstado(estado) {
  // estado = { pressed: boolean }
  return [
    styles.botao,
    { backgroundColor: estado.pressed ? "red" : "green" }
  ];
}

function BotaoPressableOk() {
  function onPress() {
    // Coloque sua ação aqui (alert, setState, etc.)
    console.log("Pressionado!");
  }

  return (
    <View style={styles.caixa}>
      <Pressable onPress={onPress} style={estiloPorEstado}>
        <Text style={styles.texto}>Botão Dinâmico</Text>
      </Pressable>
      <Text style={styles.dica}>
        Segure o botão para ver a cor mudar (verde → vermelho).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { padding: 16, gap: 12 },
  botao: { padding: 12, borderRadius: 8 },
  texto: { color: "white", textAlign: "center", fontSize: 16 },
  dica: { fontSize: 14 }
});

export default BotaoPressableOk;
