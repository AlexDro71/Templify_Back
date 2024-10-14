import pg from "pg";
import { dbConfig } from "../../db.js";

export default class UsersRepository {
    constructor () {
        const { Client } = pg;
        this.DBClient = new Client(dbConfig);
        this.DBClient.connect();
    }

    async crearUsuario(nombre, apellido, username, password, mail, empresa) {
        // Consulta para verificar si el username ya está tomado
        const usernameTomado = await this.DBClient.query(`
            SELECT * FROM usuario WHERE username = '${username}'
        `);
        if (usernameTomado.rows.length > 0) {
            throw new Error('El nombre de usuario ya está en uso');
        }
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
            WHERE username = '${username}' AND password = '${password}'
        `;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }

    async seleccionarPdP(user, nombrePdP, precio, plazo) {
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + plazo);
        const fechaInicioUTC = fechaInicio.toISOString().slice(0, 19).replace('T', ' ');
        const fechaFinUTC = fechaFin.toISOString().slice(0, 19).replace('T', ' ');

        const planResult = await this.DBClient.query(`
            INSERT into plandepago (nombre, fechainicio, fechafin, precio) 
            VALUES ('${nombrePdP}', '${fechaInicioUTC}', '${fechaFinUTC}', '${precio}') RETURNING *
        `);
        const planId = planResult.rows[0].id;

        const sql = `UPDATE usuario SET plandepago = '${planId}' WHERE id = '${user}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
    async guardarArchivo(fileUrl, userId) {
     const sql = `INSERT into archivos (idusuario, linkarchivo) VALUES ('${userId}', '${fileUrl}') RETURNING *`
     const response = await this.DBClient.query(sql);
     return response.rows[0]
    }

    async obtenerArchivos(userId) {
        const sql = `SELECT * FROM archivos WHERE idusuario = '${userId}'`
        const response = await this.DBClient.query(sql)
        return response.rows
    }

    async getUserProfile(username) {
        const sql = `
          SELECT u.username, u.nombre, u.mail, u.empresa, 
                 u.telefono, u.plandepago, p.nombre as plan_nombre, 
                 p.precio, p.fechainicio, p.fechafin
          FROM usuario u
          LEFT JOIN plandepago p ON u.plandepago = p.id
          WHERE u.username = '${username}'
        `;
        const response = await this.DBClient.query(sql);  // Pasa el ID como parámetro
        return response.rows[0];
      }




      

    async updateUserProfile(userId, field, value) {
        const sql = `UPDATE usuario SET ${field} = '${value}' WHERE id = '${userId}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
}
