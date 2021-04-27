import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import Row from '../components/row'
import styles from '../styles/styles'
import styles_card from '../styles/cards_modal_styles'

export default class CardItemList extends Component{
    constructor(props){
        super(props)
        this.card = props.card
        this.deleteClick = props.deleteClick
        this.editClick = props.editClick
    }
    render(){
        return (
            <View style={styles_card.card_model_border}>
                <View style={styles_card.card_model}>
                    <Row>
                        <TouchableOpacity style={styles.item_baralho_base} onPress={() => this.deleteClick(this.card)}>
                            <Text style={styles.text_underline_decoration_blue}>Deletar</Text>
                        </TouchableOpacity>
                        <View style={{width: 20}}/>
                        <TouchableOpacity style={styles.item_baralho_base} onPress={() => this.editClick(this.card)}>
                            <Text style={styles.text_underline_decoration_blue}>Editar</Text>
                        </TouchableOpacity>
                    </Row>
                    <View style={{height: 10}}/>
                    <Row>
                        <Text style={styles.obs_big}>Frente: </Text>
                        <Text style={styles.obs_big_no_bold}>{this.card.frente}</Text>
                    </Row>
                    <View style={{height: 10}}/>
                    <Row>
                        <Text style={styles.obs_big}>Verso: </Text>
                        <Text style={styles.obs_big_no_bold}>{this.card.verso}</Text>
                    </Row>
                </View>
            </View>
        )
    }
}