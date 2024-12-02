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
        console.log("Repository: 'guardarArchivo' - Ejecutando query para insertar archivo");
        const sql = `INSERT INTO archivos (idusuario, linkarchivo, nombrearchivo) VALUES ('${userId}', '${fileUrl}', '${fileName}') RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
        
    async obtenerArchivos(userId) {
        console.log("Repository: obtenerArchivos - Iniciando consulta a la base de datos");
        const sql = `SELECT * FROM archivos WHERE idusuario = '${userId}'`;
        const response = await this.DBClient.query(sql);
        console.log("Repository: obtenerArchivos - Resultado de la consulta:", response.rows);
        return response.rows;
      }

      async obtenerFotoPerfil(userId) {
        console.log("Repository: obtenerFotoPerfil - Ejecutando consulta SQL para obtener la foto de perfil");
        const sql = `SELECT fotoperfil FROM usuario WHERE id = $1`;
        const response = await this.DBClient.query(sql, [userId]);
        console.log("Repository: obtenerFotoPerfil - Resultado de la consulta:", response.rows[0]);
        return response.rows[0];
      }
        

        async eliminarArchivoBD(idArchivo) {
            console.log("Repository: 'eliminarArchivoBD' - Ejecutando query para eliminar archivo");
            const sql = `DELETE FROM archivos WHERE id = '${idArchivo}' RETURNING *`;
            const response = await this.DBClient.query(sql);
            return response.rows[0];
        }

        async actualizarFotoPerfil(userId, fileUrl) {
            console.log("Repository: actualizarFotoPerfil - Iniciando consulta a la base de datos");
            const sql = `UPDATE usuario SET fotoperfil = '${fileUrl}' WHERE id = '${userId}' RETURNING *`;
            const response = await this.DBClient.query(sql);
            console.log("Repository: actualizarFotoPerfil - Resultado de la consulta:", response.rows[0]);
            return response.rows[0];
          }

    async obtenerFotoPerfil(userId) {
        console.log("Repository: obtenerFotoPerfil - Iniciando consulta a la base de datos");
        const sql = `SELECT fotoperfil FROM usuario WHERE id = '${userId}'`;
        const response = await this.DBClient.query(sql);
        console.log("Repository: obtenerFotoPerfil - Resultado de la consulta:", response.rows[0]);
        return response.rows[0];
      }

      async eliminarFotoPerfilBD(userId) {
        console.log("Repository: eliminarFotoPerfilBD - Iniciando consulta a la base de datos");
        const sql = `UPDATE usuario SET fotoperfil = NULL WHERE id = '${userId}' RETURNING *`;
        const response = await this.DBClient.query(sql);
        console.log("Repository: eliminarFotoPerfilBD - Resultado de la consulta:", response.rows[0]);
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

    async obtenerTemplates(userId) {
        console.log('Repository: obtenerTemplates - Ejecutando consulta');
        const sql = `
          SELECT plantilla.id, plantilla.nombre, plantilla.linktemplate 
          FROM plantilla 
          JOIN planxus ON plantilla.id = planxus.idplantilla 
          WHERE planxus.idusuario = $1
        `;
        const response = await this.DBClient.query(sql, [userId]);
        console.log('Repository: obtenerTemplates - Resultados:', response.rows);
        return response.rows;
      }

      async obtenerTemplatesPublicos() {
        console.log('Repository: obtenerTemplatesPublicos - Consultando base de datos');
        const sql = `
          SELECT id, linktemplate, nombre 
          FROM plantilla 
          WHERE linktemplate LIKE '%/Base/%'
        `;
        const response = await this.DBClient.query(sql);
        console.log('Repository: obtenerTemplatesPublicos - Resultados:', response.rows);
        return response.rows;
      }s
    
      
      async crearTemplate(userId, nombre, linkTemplate) {
        console.log('Repository: crearTemplate - Insertando en la base de datos');
      
        // Insertar el template en `plantilla`
        const plantillaQuery = `
          INSERT INTO plantilla (linktemplate, nombre) 
          VALUES ($1, $2) 
          RETURNING id
        `;
        const plantillaResponse = await this.DBClient.query(plantillaQuery, [linkTemplate, nombre]);
        const templateId = plantillaResponse.rows[0].id;
      
        // Asociar el template al usuario en `planxus`
        const planxusQuery = `
          INSERT INTO planxus (idplantilla, idusuario) 
          VALUES ($1, $2)
        `;
        await this.DBClient.query(planxusQuery, [templateId, userId]);
      
        console.log('Repository: crearTemplate - Template y asociación creados con éxito');
        return templateId; // Retornar el ID del template creado
      }

      async obtenerTemplatePorId(templateId) {
        console.log('Repository: obtenerTemplatePorId - Iniciando consulta a la base de datos');
        const sql = `
          SELECT linktemplate, nombre 
          FROM plantilla 
          WHERE id = $1
        `;
        const response = await this.DBClient.query(sql, [templateId]);
        console.log('Repository: obtenerTemplatePorId - Resultado:', response.rows[0]);
        return response.rows[0];
      }

      async actualizarTemplates(templateId){
        const sql = `UPDATE plantilla SET linktemplate = '${a}' WHERE id = '${templateId}' RETURNING *`
        const response = await this.DBClient.query(sql);
        return response.rows[0];
      }

}
