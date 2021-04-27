import databaseClass from './LExpoDatabase'
import Consts from '../utils/Consts'
import Card from '../models/Card'

export default class CardsDB{
    constructor(){
        this.db = new databaseClass(Consts.database_name)
        this.db.executeQuery(`CREATE TABLE IF NOT EXISTS ${Consts.baralhocards_tablename}(id integer primary key autoincrement, frente text, verso text, last_date text, success_count integer, database_id integer REFERENCES ${Consts.baralhoconfigdb_tablename}(id) ON UPDATE CASCADE ON DELETE CASCADE)`)
    }
    novoCard(card){
        return new Promise(resolve => {
            this.db.executeQuery(`INSERT INTO ${Consts.baralhocards_tablename} (frente, verso, last_date, success_count, database_id) VALUES ('${card.frente}', '${card.verso}', '${card.last_date}', 0, ${card.database_id})`, () => {
                resolve(true)
            }, _=>{
                console.log("Erro ao criar novo card!")
                resolve(false)
            })
        })
    }
    editarCard(card){
        return new Promise(resolve => {
            this.db.executeQuery(`UPDATE ${Consts.baralhocards_tablename} SET frente='${card.frente}', verso='${card.verso}', last_date='${card.last_date}', success_count=${card.success_count} WHERE id=${card.id}`, ()=>{ resolve(true) }, _ => {
                console.log("Não foi possível atualizar o card!")
                resolve(false)
            })
        })
    }
    removerCard(cardId){
        return new Promise(resolve => {
            this.db.executeQuery(`DELETE FROM ${Consts.baralhocards_tablename} WHERE id=${cardId}`, () => {
                resolve(true)
            }, _=>{
                console.log("Erro ao deletar card!")
                resolve(false)
            })
        })
    }
    getCardsFromBaralho(baralhoId){
        return new Promise((resolve, reject) => {
            this.db.executeQuery(`SELECT * FROM ${Consts.baralhocards_tablename} WHERE database_id=${baralhoId}`, (_, res) => {
                const results = res.rows._array
                const cards = []
                results.forEach(result => {
                    cards.push(new Card(result))
                })
                resolve(cards)
            }, error => {
                console.log("Não foi possível pegar os cards!")
                reject(error)
            })
        })
    }
}