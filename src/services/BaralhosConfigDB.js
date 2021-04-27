import databaseClass from './LExpoDatabase'
import Consts from '../utils/Consts'
import BaralhoBase from '../models/BaralhoBase'

export default class BaralhoConfigDB{
    constructor(){
        this.db = new databaseClass(Consts.database_name)
        this.db.executeQuery(`CREATE TABLE IF NOT EXISTS ${Consts.baralhoconfigdb_tablename}(id integer primary key autoincrement, nome text)`, ()=>{}, error=>console.log(error))
    }
    criarBaralho(baralhoName){
        return new Promise(resolve => {
            this.db.executeQuery(`INSERT INTO ${Consts.baralhoconfigdb_tablename} (nome) VALUES ('${baralhoName}')`, () => {
                resolve(true)
            }, _=>{
                console.log("Erro ao criar novo banco de dados!")
                resolve(false)
            })
        })
    }
    deletarBaralho(baralhoId){
        return new Promise(resolve => {
            this.db.executeQuery(`DELETE FROM ${Consts.baralhoconfigdb_tablename} WHERE id=${baralhoId}`, () => {
                resolve(true)
            }, _ => {
                console.log("Erro ao deletar baralho")
                resolve(false)
            })
        })
    }
    getBaralhos(){
        return new Promise((resolve, reject) => {
            this.db.executeQuery(`SELECT * FROM ${Consts.baralhoconfigdb_tablename}`, (_, res)=>{
                const results = res.rows._array
                const baralhos = []
                results.forEach(result => {
                    baralhos.push(new BaralhoBase(result))
                })
                resolve(baralhos)
            }, error => {
                console.log(error)
                reject(error)
            })
        })
    }
    getBaralho(baralhoId){
        return new Promise((resolve) => {
            this.getBaralhos().then(baralhos => {
                baralhos.forEach(baralho => {
                    if(baralho.id == baralhoId) resolve(baralho)
                });
                resolve(null)
            })
        })
    }
    exists(baralhoName){
        return new Promise(resolve => {
            this.getBaralhos().then(baralhos => {
                baralhos.forEach(baralho => {
                    if(baralho.nome.toLowerCase() == baralhoName.toLowerCase())
                        resolve(true)
                })
                resolve(false)
            })
        })
    }
    existsById(baralhoId){
        return new Promise(resolve => {
            this.getBaralho().then(baralho => { resolve(baralho != null) })
        })
    }
}