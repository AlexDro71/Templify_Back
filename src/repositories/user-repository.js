import msSQL from "mssql";
import  {dbConfig}  from "./../../db.js";
import { getConnetion } from "../../connection.js";


export default class UsersRepository{
    async crearUsuario(nombre, apellido, username, password, mail, empresa){
        const sql = `INSERT INTO Usuario (empresa, nombre, mail, password, apellido, username)
        VALUES ('${empresa}', '${nombre}', '${mail}', '${password}', '${apellido}', '${username}')`;
            console.log(sql)
            const pool = await getConnetion();
            const response = await pool.request().query(sql)
            return response.rows, console.log(`Usuario '${username}' creado Correctamente`)
    }

    async usuarioExiste(username, password){
        const sql = `SELECT * 
        FROM Usuario
        WHERE username = '${username}' and password = '${password}'`
        console.log(sql)
        const pool = await getConnetion();
        const response = await pool.request().query(sql)
        console.log(response.recordset)
        if(response.recordset == ""){
            return false;
        }else{
        return response.recordset
        }
    }
}
