import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import cardsDBClass from '../services/CardsDB'
import Spinner from 'react-native-loading-spinner-overlay'
import spinner_styles from '../styles/spinner_styles'
import styles_card from '../styles/cards_modal_styles'
import Colors from '../styles/Colors'
import Resolution from '../utils/Resolution'

const cartasPorPratica = 10 //MAX CARDS TO DO

export default class PraticarPage extends Component{
    constructor(props){
        super(props)
        this.navigation = props.navigation
        this.params = props.route.params
        this.db
        this.dbCards = new cardsDBClass()
        this.baralho_id = this.params.baralho_id
        this.onlyCardsNeedDo = this.params.onlyCardsNeedDo
        this.state = {
            isLoading: false,
            cardsPraticar: [],
            cardPraticando: null,
            isFrente: true,
        }
        setTimeout(() => {
            this.setState({isLoading: true})
            this.selectCards().then(cards => {
                this.setState({cardsPraticar: cards})
                if(this.state.cardsPraticar.length <= 0){
                    this.navigation.pop()
                    alert('Não há cartas para revisar!\nPode descançar!')
                }else{
                    this.nextCard(0)
                    this.setState({isLoading: false})
                }
            }).catch(_ => {
                this.navigation.pop()
                alert('Erro ao carregar cartas!')
            })
        }, 0)
    }
    render(){
        return (
            <View style={{flex: 1}}>
                {
                    this.state.isLoading ? (
                        <Spinner
                            visible={true}
                            textContent={'Carregando...'}
                            textStyle={spinner_styles.spinnerTextStyle}
                        />
                    )
                    : this.state.cardPraticando != null ? (this.render_page())
                    : (<></>)
                }
            </View>
        )
    }
    render_page(){
        return (
            <View style={{flex: 1,}}>
                {/* PRATICAR */}
                <TouchableOpacity style={{margin: 20,}} onPress={()=>{this.setState({isFrente: !this.state.isFrente})}}>
                    <View style={styles_card.card_praticando_border}>
                        <View style={styles_card.card_praticando_body}>
                            {
                                this.state.isFrente ? (
                                    <View>
                                        <View style={{flexDirection: 'row',}}>
                                            <Text style={styles_card.frente_verso}>Frente</Text>
                                            <Text style={{position:'absolute', right: 0, top: 10, fontSize: Resolution.isBig() ? 24 : 14, color: `${Colors.black}aa`}}>Clique para virar</Text>
                                        </View>
                                        <View style={{marginHorizontal: 10, marginVertical: 60, alignItems: 'center'}}>
                                            <Text style={styles_card.card_content}>{this.state.cardPraticando.frente}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <View style={{flexDirection: 'row',}}>
                                            <Text style={styles_card.frente_verso}>Verso</Text>
                                            <Text style={{position:'absolute', right: 0, top: 10, fontSize: Resolution.isBig() ? 24 : 14, color: `${Colors.black}aa`}}>Clique para virar</Text>
                                        </View>
                                        <View style={{marginHorizontal: 10, marginVertical: 60, alignItems: 'center'}}>
                                            <Text style={styles_card.card_content}>{this.state.cardPraticando.verso}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {/* OPIÇÕES */}
                <View style={{flexDirection: 'row', marginHorizontal: 20,}}>
                    <TouchableOpacity style={{width: Resolution.width / 3}} onPress={() => {
                        this.nextCard(1)
                    }}>
                        <Text style={{fontSize: Resolution.isBig() ? 26 : 12, color: Colors.option_secundary_color}}>Facil({this.convertNextStageToString(this.state.cardPraticando.getNextStage())})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: Resolution.width / 3}} onPress={() => {
                        this.nextCard(2)
                    }}>
                        <Text style={{fontSize: Resolution.isBig() ? 26 : 12, color: Colors.yellow}}>Médio(30Min)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: Resolution.width / 3}} onPress={() => {
                        this.nextCard(3)
                    }}>
                        <Text style={{fontSize: Resolution.isBig() ? 26 : 12, color: Colors.red}}>Difícil(Refazer)</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    //CARDS
    selectCards(){
        return new Promise((resolve, reject) => {
            //SELECT CARDS AND RETURN
            this.dbCards.getCardsFromBaralho(this.baralho_id).then(cards => {
                let cartasAdded = []
                //Lógica de escolha
                let indexs = []
                for(let i = 0; i < cards.length; i++) indexs.push(i) //CRIA O ARRAY
                while(indexs.length > 0 && cartasAdded.length < cartasPorPratica){
                    let index = indexs[Math.floor(Math.random() * indexs.length)]
                    if(cartasAdded.length < cartasPorPratica && (this.onlyCardsNeedDo ? cards[index].needDoIt() : true))
                        cartasAdded.push(cards[index]) //ADD CARD TO DO
                    indexs.splice(index, 1)
                }
                resolve(cartasAdded)
            }).catch(error => {reject(error)})
        })
    }
    nextCard(dif){
        switch(dif){
            case 1:
                this.state.cardPraticando.markSuccess(this.dbCards)
                break;
            case 2:
                this.state.cardPraticando.setSuccess(this.dbCards, 1)
                break;
            case 3:
                this.state.cardPraticando.setSuccess(this.dbCards, 0)
                break;
        }
        if(this.state.cardsPraticar.length > 0){
            var cards = this.state.cardsPraticar
            let next_card = cards[0]
            cards.splice(0, 1)
            this.setState({isFrente:true, cardsPraticar: cards, cardPraticando: next_card})
        }else{
            this.navigation.pop()
            alert('Bom trabalho!')
        }
    }
    convertNextStageToString(nextStage){
        return nextStage < 1 ? `${nextStage*60}Min` : `${nextStage}H`
    }
}