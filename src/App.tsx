import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Comp1 from './components/botoes/Comp1';
import Comp2, {Comp2a,Comp2b} from './components/botoes/Comp2';
import Comp3 from './components/botoes/Comp3';
import Comp4 from './components/botoes/Comp4';
import Estilo01 from './exercicios/Estilo01';
import Estilo from './styles/Estilo';
import CompEstiloso from './styles/CompEstiloso';

function Kaug() {
  return (

    <View>

      {/* 
      <Text>
        HELLO WORLD!!
      </Text>


      <Comp4/>
       */}
    <CompEstiloso/>

  
    </View>
  );
}



export default Kaug;