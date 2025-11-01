import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

function BotaoCustom() {
  const [clicks, setClicks] = useState(0);

  function handlePress() {
    setClicks(clicks + 1);
  }

  return (
    <View style={styles.caixa}>
      <TouchableOpacity style={styles.botao} onPress={handlePress}>
        <Text style={styles.texto}>Clique Aqui</Text>
      </TouchableOpacity>

      <Text style={styles.info}>Cliques: {clicks}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { padding: 16, gap: 12 },
  botao: { backgroundColor: "blue", padding: 12, borderRadius: 8 },
  texto: { color: "white", fontSize: 16, textAlign: "center" },
  info: { fontSize: 16 }
});

export default BotaoCustom;
