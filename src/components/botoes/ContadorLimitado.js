import { useState } from "react";
import { Text,Button,View } from "react-native";

function ContadorLimitado() {
  const [valor, setValor] = useState(0);

  return (
    <View>
      <Text>Valor: {valor}</Text>
      <Button
        title="Incrementar"
        onPress={() => setValor(valor + 1)}
        disabled={valor >= 10} // Desabilita quando valor >= 10
      />
      <Button
        title="Decrementar"
        onPress={() => setValor(valor - 1)}
        disabled={valor <= 0} // Desabilita quando valor <= 0
      />
    </View>
  );
}

export default ContadorLimitado;