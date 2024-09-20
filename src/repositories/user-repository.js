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
    

    async autenticarUsuario(username, password) {
        const sql = `
            SELECT * 
            FROM usuario
            WHERE username = '${username}' AND password = '${password}';
        `;

        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
    async seleccionarPdP(user, nombrePdP, precio, plazo) {
        console.log("Datos: User: "+ user + " nombrePdp: " + nombrePdP + " precio: " + precio + " plazo: " + plazo);
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + plazo);
        
        const fechaInicioUTC = fechaInicio.toISOString().slice(0, 19).replace('T', ' ');
        const fechaFinUTC = fechaFin.toISOString().slice(0, 19).replace('T', ' ');
    
       
        const result = await this.DBClient.query(`INSERT into plandepago (nombre, fechainicio, fechafin, precio)
        VALUES ('${nombrePdP}', '${fechaInicioUTC}', '${fechaFinUTC}', '${precio}') RETURNING id`);
    
        const planId = result.rows[0].id
    
        const sql = `UPDATE usuario SET plandepago = '${planId}' WHERE id = '${user}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
    

    async editarUsuario(tabla, user, password, cambio, username){
        if(this.autenticarUsuario(username, password)){
        const sql = `UPDATE usuario SET '${tabla}' = '${cambio}' WHERE id = '${user}' RETURNING *`
        const response = await this.DBClient.query(sql);
        return response.rows[0];
        }else{
            return null;
        }
    }
}