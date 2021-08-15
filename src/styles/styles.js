import { StyleSheet } from 'react-native'
import Resolution from '../utils/Resolution'
import Colors from './Colors'

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.secundaryColor,
    },
    bodyPage: {
        margin: '5%',
    },
    title: {
        fontSize: Resolution.isBig() ? 48 : 28,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textDecorationLine: 'underline'
    },
    subtitle: {
        fontSize: Resolution.isBig() ? 36 : 22,
        fontWeight: 'bold'
    },
    item_baralho_base: {
        marginTop: '3%',
    },
    text_underline_decoration_blue: {
        fontSize: Resolution.isBig() ? 32 : 20,
        color: Colors.option_primary_color,
        textDecorationColor: Colors.option_primary_color,
        textDecorationLine: 'underline',
    },
    text_underline_decoration_light_blue: {
        fontSize: Resolution.isBig() ? 32 : 20,
        color: Colors.option_secundary_color,
        textDecorationColor: Colors.option_secundary_color,
        textDecorationLine: 'underline',
    },
    button_text: {
        color: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: Resolution.isBig() ? 28 : 16,
    },
    input: {
        backgroundColor: Colors.white,
        padding: Resolution.isBig() ? 20 : 10,
        fontSize: Resolution.isBig() ? 24 : 16,
    },
    obs: {
        fontSize: Resolution.isBig() ? 22 : 12,
        fontWeight: 'bold'
    },
    obs_big: {
        fontSize: Resolution.isBig() ? 26 : 14,
        fontWeight: 'bold'
    },
    obs_big_no_bold: {
        fontSize: Resolution.isBig() ? 26 : 14,
    },
    // blue_button: {
    //     backgroundColor: Colors.option_primary_color,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingHorizontal: Resolution.isBig() ? 20 : 15,
    //     paddingVertical: Resolution.isBig() ? 15 : 12,
    // },
    height_banner_size: {
        height: 50,
    }
})