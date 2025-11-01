import React from 'react'
 import { Button } from 'react-native'

 
 function Botao(){    
    function executar(){        
        console.warn('Exec #01!!!')        
    }
    return (
        <>
            <Button
                title="Executar #01!"
                onPress={executar}
            />
            <Button
                title="Executar #02!"
                onPress={function() {
                        console.warn('Exec #02!!!')
                }}
            />
        </>
    )
 }//fim function Botao
 export default Botao;
