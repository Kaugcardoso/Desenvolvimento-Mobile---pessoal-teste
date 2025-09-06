import React from 'react';
import { Text, View } from 'react-native';
import Estilo from './Estilo';


export default function CompEstiloso() {
  return (
    <React.Fragment>
      <View style={Estilo.container}>
    
      <Text style={Estilo.title}>Título Principal</Text>
      <Text style={Estilo.subtitle}>Subtítulo Centralizado</Text>
      <Text style={Estilo.paragraph}>
        Este é um parágrafo de exemplo que mostra como o texto pode ser
        formatado usando várias propriedades de estilo no React Native.
      </Text>
      </View>      
      <View style={Estilo.container2}>
      <Text style={Estilo.highlight}>Texto Destacado com Fundo e Cor</Text>
      <Text style={Estilo.borderText}>Texto com Borda e Margem</Text>
      <Text style={Estilo.roundedText}>
        Texto com Borda Arredondada e Padding
      </Text>    
      <Text style={Estilo.paragraph}>
        Este é outro parágrafo de exemplo que mostra como o texto pode ser
        formatado usando várias propriedades de estilo no React Native.
      </Text>      
      </View>
   </React.Fragment>
  );
}

