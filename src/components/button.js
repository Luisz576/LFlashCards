import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native'
import { Box } from 'native-base' //Native base components
import Colors from '../styles/Colors';

export default class Button extends Component{
    constructor(props){
        super(props)
        this.text = props.text
        this.onPress = props.onPress
    }
    render(){
        return (
            <TouchableOpacity onPress={this.onPress}>
                <Box
                    bg={Colors.primaryColor}
                    p={4}
                    _text={{
                        fontSize: "md",
                        fontWeight: "bold",
                        color: "white",
                    }
                }>{this.text}</Box>
            </TouchableOpacity>
        )
    }
}