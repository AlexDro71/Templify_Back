import {dbConfig} from "./db.js"
import sql from "mssql"

export async function getConnetion() {
    try{
        const pool = await sql.connect(dbConfig)
        return pool;
    }catch(error){
        console.error(error)
    }
}