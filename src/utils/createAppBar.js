import Colors from '../styles/Colors'

export default function createStyle(title){
    return {
        title: title,
        headerStyle: {
            backgroundColor: Colors.primaryColor,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontSize: 28,
            fontWeight: 'normal',
        },
    }
}