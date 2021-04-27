import meses from '../utils/meses'
import CardUtils from '../utils/cardUtils'
import cardUtils from '../utils/cardUtils'

export default class Card{
    constructor(obj){
        this.id = obj.id
        this.frente = obj.frente
        this.verso = obj.verso
        this.last_date = obj.last_date
        this.success_count = obj.success_count
        this.database_id = obj.database_id
    }
    needDoIt(){
        //TODA LÓGICA DE SE PRECISA REVISAR
        const date_now_in_ms = Date.now()
        var horas_diferença = (date_now_in_ms - this.getLastDate().getTime()) / 1000 / 60 / 60
        switch(this.success_count){
            case 0: //IMEDIATO
                return true
            case 1: //APÓS 0,5H
                return horas_diferença >= 0.5
            case 2: //APÓS 1H
                return horas_diferença >= 1
            case 3: //APÓS 24H
                return horas_diferença >= 24
            case 4: //APÓS 96H
                return horas_diferença >= 96
            default:
                return false //CASO DE ERRO
        }
    }
    setSuccess(dbCard, success){
        return new Promise(resolve => {
            //UPDATE DATA
            this.last_date = cardUtils.formatDateToSave(new Date(Date.now()))
            this.success_count = success
            //DATABASE
            dbCard.editarCard(this).then(_ => {resolve(true)}).catch(_ => {resolve(false)})
        })
    }
    markSuccess(dbCard){
        return this.setSuccess(dbCard, (this.success_count < 4 ? this.success_count + 1 : 4))
    }
    getNextStage(){
        switch(this.success_count){
            case 0:
                return 0.5;
            case 1:
                return 1;
            case 2:
                return 24;
            default:
                return 96;
        }
    }
    getLastDate(){
        let new_date = this.last_date.toString().split('-') //new_date[2] <= Includes the hour
        return new Date(`${this._convert_month(new_date[0] - 1)} ${new_date[1]} ${new_date[2]}`)
    }
    _convert_month(month){ return meses[parseInt(month)] }
}