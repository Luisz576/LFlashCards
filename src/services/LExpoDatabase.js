const SQLite = require('expo-sqlite')

var db = null
export default class Database{
    constructor(database_name) {
        db = SQLite.openDatabase(database_name)
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, ()=>{});
        return this
    }
    executeQuery(query, success, error){
        if(db && db != null)
            db.transaction(tx => { tx.executeSql(query, [], success ? success : ()=>{}, error ? error : (_) => {}) })
        else{
            console.log("Não há conexão com o banco de dados")
            if(error) error("[ERROR] Sem conexão com o banco de dados")
        }
    }
}