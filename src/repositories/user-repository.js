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
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [empresa, nombre, mail, password, apellido, username];
        const response = await this.DBClient.query(sql, values);
        return response.rows[0];
    }

    async autenticarUsuario(username) {
        const sql = `
            SELECT * 
            FROM usuario
            WHERE username = $1;
        `;
        const values = [username];
        const response = await this.DBClient.query(sql, values);
        return response.rows[0];
    }

    async seleccionarPdP(user, nombrePdP, precio, plazo) {
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + plazo);
        const fechaInicioUTC = fechaInicio.toISOString().slice(0, 19).replace('T', ' ');
        const fechaFinUTC = fechaFin.toISOString().slice(0, 19).replace('T', ' ');
        
        const planResult = await this.DBClient.query(
            `INSERT into plandepago (nombre, fechainicio, fechafin, precio) 
             VALUES ($1, $2, $3, $4) RETURNING id`, 
            [nombrePdP, fechaInicioUTC, fechaFinUTC, precio]
        );
        const planId = planResult.rows[0].id;

        const sql = `UPDATE usuario SET plandepago = $1 WHERE id = $2 RETURNING *`;
        const response = await this.DBClient.query(sql, [planId, user]);
        return response.rows[0];
    }

    getUserProfile = async (userId) => {
        const sql = `
            SELECT u.username, u.nombre, u.mail, u.empresa, 
            u.telefono, p.nombre as plan_nombre, 
            p.precio, p.fechainicio, p.fechafin
            FROM usuario u
            LEFT JOIN plandepago p ON u.plandepago = p.id
            WHERE u.id = $1
        `;
        const values = [userId];
        const response = await this.DBClient.query(sql, values);
        return response.rows[0];
    };

    updateUserProfile = async (userId, field, value) => {
        const sql = `UPDATE usuario SET ${field} = $1 WHERE id = $2 RETURNING *`;
        const response = await this.DBClient.query(sql, [value, userId]);
        return response.rows[0];
    };
}
