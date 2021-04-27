import { StyleSheet } from 'react-native'
import Resolution from '../utils/Resolution'
import Colors from './Colors'

export default StyleSheet.create({
    card_model_border: {
        backgroundColor: Colors.tertiaryColor,
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 7,
        paddingVertical: 7,
    },
    card_model: {
        backgroundColor: Colors.secundaryColor,
        padding: '4%',
        paddingTop: 0,
    },
    modal_background: {
        backgroundColor: `${Colors.black}aa`,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        backgroundColor: `${Colors.secundaryColor}`,
        width: '80%',
        padding: '5%',
    },
    card_praticando_border: {
        backgroundColor: Colors.tertiaryColor,
        marginTop: 10,
        padding: 5,
    },
    card_praticando_body: {
        backgroundColor: Colors.secundaryColor,
        padding: 10,
        paddingTop: 0,
    },
    frente_verso: {
        marginTop: 10,
        color: `${Colors.black}aa`,
        fontSize: Resolution.isBig() ? 18 : 12,
    },
    card_content: {
        fontSize: Resolution.isBig() ? 32 : 20,
    }
})