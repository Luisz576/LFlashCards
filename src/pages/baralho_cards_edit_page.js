import React, { Component } from 'react';
import { Modal, View, Text, TextInput, ScrollView } from 'react-native'
import Button from '../components/button'
import Row from '../components/row'
import cardsDBClass from '../services/CardsDB'
import styles from '../styles/styles'
import spinner_styles from '../styles/spinner_styles'
import Spinner from 'react-native-loading-spinner-overlay'
import styles_modal from '../styles/cards_modal_styles'
import CardItemList from '../components/card_item_list';

export default class BaralhoCardsEditPage extends Component{
    constructor(props){
        super(props)
        this.dbCards = new cardsDBClass()
        this.navigation = props.navigation
        this.params = props.route.params
        this.baralho = {id: this.params.baralho_id}
        this.state = {
            isLoading: false,
            cards: [],
            card_in_action: null,
            modal_delete_card_visible: false,
            modal_edit_card_visible: false,
            edit_frente: '',
            edit_verso: '',
        }
        setTimeout(() => {
            this._refresh_cards()
        }, 0)
    }

    render(){
        return (
            <View>
                { 
                    !this.state.isLoading ? this._render_page() //CARREGOU
                        : (<Spinner
                            visible={true}
                            textContent={'Carregando...'}
                            textStyle={spinner_styles.spinnerTextStyle}
                        />) //CARREGANDO
                }
            </View>
        )
    }

    render_card_item_list({item, instance}){
        return (
            <CardItemList key={item.id} card={item} deleteClick={(card) => {
                instance.setState({card_in_action: card, modal_delete_card_visible: true})
            }} editClick={(card) => {
                instance.setState({card_in_action: card, modal_edit_card_visible: true, edit_frente: card.frente, edit_verso: card.verso})
            }}/>
        )
    }

    _refresh_cards(){
        this.setState({ cards: [], isLoading: true });
        this.dbCards.getCardsFromBaralho(this.baralho.id).then(cards => { this.setState({ cards: cards, isLoading: false }); })
    }

    _render_page(){
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.bodyPage}>
                    <Text style={styles.title}>Cartas do baralho</Text>
                    <View style={{height: 10}}/>
                    {
                        this.state.cards.length > 0 ? 
                            this.state.cards.map(card => {
                                return this.render_card_item_list({item: card, instance: this})
                            })
                        :
                            (<Text style={styles.obs_big}>Não há cartas cadastradas!</Text>)
                    }
                </ScrollView>

                {/* MODAL DELETAR */}
                <Modal
                    transparent={true}
                    visible={this.state.modal_delete_card_visible}
                    onRequestClose={()=>this.setState({modal_delete_card_visible: false, card_in_action: null,})}>
                    <View style={styles_modal.modal_background}>
                        <View style={styles_modal.modal}>
                            <Text style={styles.subtitle}>Deseja deletar esta carta?</Text>
                            <View style={{height: 10}}></View>
                            <Text style={styles.obs_big}>Após a carta ser deletada, não será possível recupera-la!</Text>
                            <View style={{alignItems: 'flex-end', marginTop: 10}}>
                                <Row>
                                    <Button text="Cancelar" onPress={()=>{this.setState({modal_delete_card_visible: false, card_in_action: null,})}}/>
                                    <View style={{width: 10}}/>
                                    <Button text="Confirmar" onPress={()=>{
                                        if(this.state.card_in_action != null)
                                            this.dbCards.removerCard(this.state.card_in_action.id).then(result => {
                                                if(!result)
                                                    alert("Não foi possível deletar esta carta!")
                                                else
                                                    this._refresh_cards()
                                            })
                                        else
                                            alert("Não foi possível deletar esta carta!")
                                        this.setState({
                                            modal_delete_card_visible: false,
                                            card_in_action: null,
                                        })
                                    }}/>
                                </Row>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                {/* MODAL EDITAR */}
                <Modal
                    transparent={true}
                    visible={this.state.modal_edit_card_visible}
                    onRequestClose={()=>this.setState({modal_edit_card_visible: false, card_in_action: null, edit_frente:'' ,edit_verso: ''})}>
                    <View style={styles_modal.modal_background}>
                        <View style={styles_modal.modal}>
                            <Text style={styles.subtitle}>Editar carta</Text>
                            <View style={{height: 10}}></View>
                            <TextInput style={styles.input} value={this.state.edit_frente} placeholder="Frente" onChangeText={text => {
                                this.setState({
                                    edit_frente: text
                                })
                            }}/>
                            <View style={{height: 10}}></View>
                            <TextInput style={styles.input} value={this.state.edit_verso} placeholder="Verso" onChangeText={text => {
                                this.setState({
                                    edit_verso: text
                                })
                            }}/>
                            <View style={{alignItems: 'flex-end', marginTop: 10}}>
                                <Row>
                                    <Button text="Cancelar" onPress={()=>{this.setState({modal_edit_card_visible: false, card_in_action: null})}}/>
                                    <View style={{width: 10}}/>
                                    <Button text="Salvar" onPress={()=>{
                                        this.state.card_in_action.frente = this.state.edit_frente
                                        this.state.card_in_action.verso = this.state.edit_verso
                                        this.dbCards.editarCard(this.state.card_in_action).then(result => {
                                            if(!result)
                                                alert('Não foi possível editar!')
                                            else
                                                this._refresh_cards()
                                        })
                                        this.setState({modal_edit_card_visible: false, card_in_action: null, edit_frente:'' ,edit_verso: ''})
                                    }}/>
                                </Row>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}