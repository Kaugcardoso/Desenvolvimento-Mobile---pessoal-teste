import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {    
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#909090',
      },
      container2: {        
        alignItems: 'flex-end',
        padding: 20,
        backgroundColor: 'black',
      },  
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
      },
      paragraph: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
        color: '#444',
        marginBottom: 20,
      },
      highlight: {
        fontSize: 18,
        backgroundColor: 'yellow',
        color: '#000',
        padding: 10,
        borderRadius: 5,
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
      },
      borderText: {
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#2196f3',
        padding: 10,
        margin: 10,
        color: '#2196f3',
      },
      roundedText: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#9c27b0',
        borderRadius: 15,
        padding: 15,
        color: '#9c27b0',
        marginBottom: 20,
      },
})