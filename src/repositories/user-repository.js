import pg from "pg";
import { dbConfig } from "../../db.js";


export default class UsersRepository {
    constructor () {
        const {Client} = pg;
        this.DBClient = new Client(dbConfig);

        this.DBClient.connect();
        
    }

    async crearUsuario(nombre, apellido, username, password, mail, empresa) {
        const sql = `
            INSERT INTO usuario (empresa, nombre, mail, password, apellido, username)
            VALUES ('${empresa}', '${nombre}', '${mail}', '${password}', '${apellido}', '${username}')
            RETURNING *;
        `;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
    

    async usuarioExiste(username, password) {
        const sql = `
            SELECT * 
            FROM usuario
            WHERE username = '${username}' AND password = '${password}';
        `;

        const response = await this.DBClient.query(sql);
        if(response.rows[0] == null){
            return false;
        }else{
            return true;
        }
    }
}