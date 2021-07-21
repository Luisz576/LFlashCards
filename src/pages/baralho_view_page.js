import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import Button from '../components/button'
import Row from '../components/row'
import cardsDBClass from '../services/CardsDB'
import baralhoDBClass from '../services/BaralhosConfigDB'
import styles from '../styles/styles'
import styles_modal from '../styles/cards_modal_styles'
import CardUtils from '../utils/cardUtils'
import Card from '../models/Card';
import Spinner from 'react-native-loading-spinner-overlay'
import spinner_styles from '../styles/spinner_styles'
import FocusScreenEvent from '../components/events/FocusScreenEvent'
import * as NotificationsManager from '../services/notifications_manager'

export default class BaralhoViewPage extends Component{
    constructor(props){
        super(props)
        this.navigation = props.navigation
        this.params = props.route.params
        this.dbCards = new cardsDBClass()
        this.dbBaralho = new baralhoDBClass()
        this.state = {
            isLoading: false,
            baralho: null,
            cards: [],
            modal_add_card_visible: false,
            new_card_frente: '',
            new_card_verso: '',
            modal_remove_baralho_visible: false,
            modal_praticar_visible: false,
            token: null,
        }
        NotificationsManager.registerForPushNotificationsAsync().then(token => {
            this.setState({ token: token })
        })
    }

    render(){
        return (
            <View>
                {/* MY CUSTOM ALERT */}
                <FocusScreenEvent navigation={this.navigation} callback={()=>{
                    this.setState({isLoading:true})
                    this.dbBaralho.getBaralho(this.params.baralho_id).then(res => {
                        this.setState({isLoading:false, baralho: res})
                        this._refresh()
                    })
                }}/>
                <View horizontal={false} style={styles.bodyPage}>
                    {
                        !this.state.isLoading ?
                            this.state.baralho != null ? 
                                ( this._renderBaralhoView() ) //CARREGOU
                            :  ( <Text style={styles.obs}>Este baralho não existe!</Text> ) //NÃO EXISTE
                        : (<Spinner
                            visible={true}
                            textContent={'Carregando...'}
                            textStyle={spinner_styles.spinnerTextStyle}
                        />) //CARREGANDO
                    }
                </View>
            </View>
        )
    }

    _renderBaralhoView(){
        return (
            <>
                <Text style={styles.title}>{this.state.baralho.nome}</Text>
                <Text style={styles.obs}>{this.state.cards.length} carta(s) cadastrada(s)!</Text>
                <TouchableOpacity style={styles.item_baralho_base} onPress={() => {this.setState({modal_praticar_visible: true})}}>
                    <Text style={styles.text_underline_decoration_blue}>Praticar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item_baralho_base} onPress={() => {this.setState({modal_add_card_visible: true})}}>
                    <Text style={styles.text_underline_decoration_blue}>Adicionar cartas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item_baralho_base} onPress={() => {
                    this.navigation.push('BEdit', {baralho_id: this.state.baralho.id})
                }}>
                    <Text style={styles.text_underline_decoration_blue}>Editar cartas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item_baralho_base} onPress={() => {this.setState({modal_remove_baralho_visible: true})}}>
                    <Text style={styles.text_underline_decoration_blue}>Deletar baralho</Text>
                </TouchableOpacity>
                
                {/* MODALS */}
                {/* MODAL ADD */}
                <Modal
                    transparent={true}
                    visible={this.state.modal_add_card_visible}
                    onRequestClose={()=>this.setState({modal_add_card_visible: false, new_card_frente: '', new_card_verso: ''})}>
                    <View style={styles_modal.modal_background}>
                        <View style={styles_modal.modal}>
                            <Text style={styles.subtitle}>Nova carta</Text>
                            <View style={{height: 10}}></View>
                            <TextInput style={styles.input} placeholder="Frente" onChangeText={text => this.setState({new_card_frente: text})}/>
                            <View style={{height: 10}}></View>
                            <TextInput style={styles.input} placeholder="Verso" onChangeText={text => this.setState({new_card_verso: text})}/>
                            <View style={{alignItems: 'flex-end', marginTop: 10}}>
                                <Row>
                                    <Button text="Cancelar" onPress={()=>{this.setState({modal_add_card_visible: false, new_card_frente: '', new_card_verso: ''})}}/>
                                    <View style={{width: 10}}/>
                                    <Button text="Criar" onPress={()=>{
                                        if(this.state.new_card_frente.trim()){
                                            if(this.state.new_card_verso.trim()){
                                                let date_formatted = CardUtils.formatDateToSave(new Date(Date.now()))
                                                const new_card = new Card({frente: this.state.new_card_frente, verso: this.state.new_card_verso, last_date: date_formatted, database_id: this.state.baralho.id})
                                                this.dbCards.novoCard(new_card).then(result => {
                                                    if(!result)
                                                        alert("Erro ao criar o card!")
                                                    else{
                                                        this._refresh()
                                                        if(this.state.token)
                                                            NotificationsManager.sendPushNotification(this.state.token, {
                                                                title: "Nova carta criada!",
                                                                body: "Parabéns pela sua nova carta!!!"
                                                            })
                                                    }
                                                })
                                                this.setState({modal_add_card_visible: false, new_card_frente: '', new_card_verso: ''})
                                            }else
                                                alert("Preencha o verso!")
                                        }else
                                            alert("Preencha a frente!")
                                    }}/>
                                </Row>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* MODAL REMOVE */}
                <Modal
                    transparent={true}
                    visible={this.state.modal_remove_baralho_visible}
                    onRequestClose={()=>this.setState({modal_remove_baralho_visible: false})}>
                    <View style={styles_modal.modal_background}>
                        <View style={styles_modal.modal}>
                            <Text style={styles.subtitle}>Deseja deletar este baralho?</Text>
                            <View style={{height: 10}}></View>
                            <Text style={styles.obs_big}>Após o baralho ser deletado, não será possível recupera-lo!</Text>
                            <View style={{alignItems: 'flex-end', marginTop: 10}}>
                                <Row>
                                    <Button text="Cancelar" onPress={()=>{this.setState({modal_remove_baralho_visible: false})}}/>
                                    <View style={{width: 10}}/>
                                    <Button text="Confirmar" onPress={()=>{
                                        this.dbBaralho.deletarBaralho(this.state.baralho.id).then(result => {
                                            if(result){
                                                this.navigation.pop()
                                            }else
                                                alert("Não foi possível deletar este baralho!")
                                        })
                                    }}/>
                                </Row>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* MODAL PLAY */}
                <Modal
                    transparent={true}
                    visible={this.state.modal_praticar_visible}
                    onRequestClose={()=>this.setState({modal_praticar_visible: false})}>
                    <View style={styles_modal.modal_background}>
                        <View style={styles_modal.modal}>
                            <Text style={styles.subtitle}>Escolha o modo</Text>
                            <View style={{height: 10}}></View>
                            <Button text={`Revisão(${this._cards_to_do()})`} onPress={() => {
                                this.setState({modal_praticar_visible: false})
                                this.navigation.push('Praticar', {baralho_id: this.state.baralho.id, onlyCardsNeedDo: true})
                            }}/>
                            <View style={{height: 10}}></View>
                            <Button text={`Estudar tudo`} onPress={() => {
                                this.setState({modal_praticar_visible: false})
                                this.navigation.push('Praticar', {baralho_id: this.state.baralho.id, onlyCardsNeedDo: false})
                            }}/>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
    _refresh(){
        this.setState({isLoading: true})
        if(this.state.baralho != null)
            if(this.state.baralho.id >= 0)
                this.dbCards.getCardsFromBaralho(this.state.baralho.id).then(cards => { this.setState({ isLoading: false, cards: cards }) })
            else
                this.setState({isLoading: false})
        else
            this.setState({isLoading: false})
    }
    _cards_to_do(){
        var counter = 0
        this.state.cards.forEach(card => { if(card.needDoIt()) counter+=1 })
        return counter
    }
}