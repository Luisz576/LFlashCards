import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native'
import styles from '../styles/styles'
import Colors from '../styles/Colors'

export default class Button extends Component{
    constructor(props){
        super(props)
        this.text = props.text
        this.onPress = props.onPress
    }
    render(){
        return (
            <TouchableOpacity style={styles.blue_button} onPress={this.onPress}>
                <Text style={styles.button_text}>{this.text}</Text>
            </TouchableOpacity>
        )
    }
}