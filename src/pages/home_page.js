import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Modal, TextInput } from 'react-native'
import Button from '../components/button'
import Row from '../components/row'
import baralhosDBClass from '../services/BaralhosConfigDB'
import styles from '../styles/styles'
import styles_modal from '../styles/cards_modal_styles'
import Spinner from 'react-native-loading-spinner-overlay'
import spinner_styles from '../styles/spinner_styles'
import FocusScreenEvent from '../components/events/FocusScreenEvent'

export default class HomePage extends Component{
    constructor(props){
        super(props)
        this.db = new baralhosDBClass()
        this.navigation = props.navigation
        this.state = {
            isLoading: false,
            modal_add_visible: false,
            baralhos: [],
            new_baralho: '',
        }
        this._refresh_list()
    }
    render(){
        return (
            <ScrollView>
                {/* MY CUSTOM ALERT */}
                <FocusScreenEvent navigation={this.navigation} callback={()=>this._refresh_list()}/> 
                {
                    this.state.isLoading ? (
                        <Spinner
                            visible={true}
                            textContent={'Carregando...'}
                            textStyle={spinner_styles.spinnerTextStyle}
                        />
                    )
                    : (
                        <>
                            <View horizontal={false} style={styles.bodyPage}>
                                <Text style={styles.title}>Baralhos:</Text>
                                {
                                    this.state.baralhos.map(baralho => {
                                        return this.renderBaralho({item: baralho, navigation: this.navigation})
                                    })
                                }
                                <TouchableOpacity style={styles.item_baralho_base} onPress={() => {this.setState({modal_add_visible: true})}}><Text style={styles.text_underline_decoration_blue}>Adicionar novo baralho</Text></TouchableOpacity>
                            </View>
                            <Modal
                                transparent={true}
                                visible={this.state.modal_add_visible}
                                onRequestClose={()=>this.setState({modal_add_visible: false, new_baralho: ''})}>
                                <View style={styles_modal.modal_background}>
                                    <View style={styles_modal.modal}>
                                        <Text style={styles.subtitle}>Novo baralho</Text>
                                        <View style={{height: 10}}></View>
                                        <TextInput style={styles.input} maxLength={30} placeholder='Nome do baralho' onChangeText={text => this.setState({new_baralho: text})}/>
                                        <View style={{alignItems: 'flex-end', marginTop: 10}}>
                                            <Row>
                                                <Button text="Cancelar" onPress={()=>{this.setState({modal_add_visible: false, new_baralho: ''})}}/>
                                                <View style={{width: 10}}/>
                                                <Button text="Criar" onPress={()=>{
                                                    this.db.exists(this.state.new_baralho).then(exists => {
                                                        if(this.state.new_baralho.trim()){
                                                            if(!exists){
                                                                this.db.criarBaralho(this.state.new_baralho).then(result => {
                                                                    if(!result)
                                                                        alert("Não foi possível criar novo baralho!")
                                                                })
                                                            }else
                                                                alert("Este baralho já existe!")
                                                        }else
                                                            alert("O campo está vazio!")
                                                        this._refresh_list()
                                                        this.setState({modal_add_visible: false, new_baralho: ''})
                                                    })
                                                }}/>
                                            </Row>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </>
                    )
                }
            </ScrollView>
        );
    }
    renderBaralho({item, navigation}){
        return (
            <TouchableOpacity key={item.id} style={styles.item_baralho_base} onPress={()=>{
                navigation.push('BView', {baralho_id: item.id})
            }}>
                <Text style={styles.text_underline_decoration_light_blue}>{item.nome}</Text>
            </TouchableOpacity>
        )
    }
    _refresh_list(){
        this.db.getBaralhos().then(baralhos => {
            this.setState({baralhos: [], isLoading: true});
            this.setState({baralhos: baralhos, isLoading: false})
        }).catch(error => {
            console.log("Erro ao carregar!")
            alert("Não foi possível carregar os baralhos!\n:(")
        })
    }
}