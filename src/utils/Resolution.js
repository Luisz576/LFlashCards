import { Dimensions } from 'react-native'

export default {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    isBig(){ return this.width > 600 }
}