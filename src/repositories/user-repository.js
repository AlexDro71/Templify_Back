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

    async recibirUserId(username) {
        const sql = `SELECT id FROM usuario WHERE username = '${username}'`
        const response = await this.DBClient.query(sql)
        return response.rows[0].id
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
        async guardarArchivo(fileUrl, userId, fileName) {
            const sql = `INSERT INTO archivos (idusuario, linkarchivo, nombrearchivo) VALUES ('${userId}', '${fileUrl}', '${fileName}') RETURNING *`;
            const response = await this.DBClient.query(sql);
            return response.rows[0];
        }
        
        async obtenerArchivos(userId) {
            const sql = `SELECT * FROM archivos WHERE idusuario = '${userId}'`;
            const response = await this.DBClient.query(sql);
            return response.rows;
        }
        

    async eliminarArchivoBD(idArchivo) {
        const sql = `DELETE FROM archivos WHERE id = '${idArchivo}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];  
    }

    async actualizarFotoPerfil(userId, fileUrl){
        const sql = `UPDATE usuario SET fotoperfil = '${fileUrl}' WHERE id = '${userId}' RETURNING *`
        const response = await this.DBClient.query(sql)
        return response.rows[0];
    }

    async obtenerFotoPerfil(userId){
        const sql = `SELECT foroperfil FROM usuario WHERE id = '${userId}'`
        const response = await this.DBClient.query(sql)
        return response.rows[0];
    }

    async eliminarFotoPerfilBD(userId) {
        const sql = `UPDATE usuario SET fotoperfil = NULL WHERE id = '${userId}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
  
      

  async getUserProfile(userId) {
    const sql = `
      SELECT u.username, u.nombre, u.apellido, u.mail, u.empresa, 
             u.telefono, u.plandepago, p.nombre as plan_nombre, 
             p.precio, p.fechainicio, p.fechafin
      FROM usuario u
      LEFT JOIN plandepago p ON u.plandepago = p.id
      WHERE u.id = '${userId}'
    `;
    const response = await this.DBClient.query(sql); 
    return response.rows[0];
  }
  




      

    async updateUserProfile(userId, field, value) {
        const sql = `UPDATE usuario SET ${field} = '${value}' WHERE id = '${userId}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
}
