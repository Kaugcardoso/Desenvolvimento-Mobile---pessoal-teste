import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Comp1 from './components/Comp1';
import Comp2, {Comp2a,Comp2b} from './components/Comp2';
import Comp3 from './components/Comp3';
import Comp4 from './components/Comp4';
import Estilo01 from './exercicios/Estilo01';
import Estilo from './style/Estilo';
import CompEstiloso from './style/CompEstiloso';

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