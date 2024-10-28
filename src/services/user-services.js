import UsersRepository from '../repositories/user-repository.js';
import jwt from 'jsonwebtoken';

export default class UsersService {
    crearUsuario = async (nombre, apellido, username, password, mail, empresa) => {
        const repo = new UsersRepository();
        const returnArray = await repo.crearUsuario(nombre, apellido, username, password, mail, empresa);
        return returnArray;
    }

    recibirUserId = async (username) => {
        const repo = new UsersRepository();
        const returnArray = await repo.recibirUserId(username);
        return returnArray;
    }

    autenticarUsuario = async (username, password) => {
        const repo = new UsersRepository();
        const returnArray = await repo.autenticarUsuario(username, password);
        return returnArray;
    }

    seleccionarPdP = async (user, nombrePdP, precio, plazo) => {
        const repo = new UsersRepository();
        const returnArray = await repo.seleccionarPdP(user, nombrePdP, precio, plazo);
        return returnArray;
    }

    getUserProfile = async (username) => {
        const repo = new UsersRepository();
        const returnArray = await repo.getUserProfile(username);
        return returnArray;
    };

    updateUserProfile = async (userId, field, value) => {
        const repo = new UsersRepository();
        const returnArray = await repo.updateUserProfile(userId, field, value);
        return returnArray;
    };

    guardarArchivo = async (fileUrl, userId, fileName) => {
        console.log("Service: 'guardarArchivo' - Guardando archivo en la base de datos");
        const repo = new UsersRepository();
        const returnArray = await repo.guardarArchivo(fileUrl, userId, fileName);
        return returnArray;
    };

    obtenerArchivos = async (userId) => {
        console.log("Service: obtenerArchivos - Iniciando");
        const repo = new UsersRepository();
        const returnArray = await repo.obtenerArchivos(userId);
        console.log("Service: obtenerArchivos - Archivos obtenidos:", returnArray);
        return returnArray;
      };

    eliminarArchivoBD = async (archivoId) => {
        console.log("Service: 'eliminarArchivoBD' - Eliminando archivo de la base de datos");
        const repo = new UsersRepository();
        const returnArray = await repo.eliminarArchivoBD(archivoId);
        return returnArray;
    };

    actualizarFotoPerfil = async (userId, fileUrl) => {
        console.log("Service: actualizarFotoPerfil - Iniciando");
        const repo = new UsersRepository();
        const returnArray = await repo.actualizarFotoPerfil(userId, fileUrl);
        console.log("Service: actualizarFotoPerfil - Foto de perfil actualizada en la base de datos:", returnArray);
        return returnArray;
      };

    obtenerFotoPerfil = async (userId) => {
        console.log("Service: obtenerFotoPerfil - Iniciando");
        const repo = new UsersRepository();
        const returnArray = await repo.obtenerFotoPerfil(userId);
        console.log("Service: obtenerFotoPerfil - Foto de perfil obtenida:", returnArray);
        return returnArray;
      };

      eliminarFotoPerfilBD = async (userId) => {
        console.log("Service: eliminarFotoPerfilBD - Iniciando");
        const repo = new UsersRepository();
        const returnArray = await repo.eliminarFotoPerfilBD(userId);
        console.log("Service: eliminarFotoPerfilBD - Foto de perfil eliminada de la base de datos:", returnArray);
        return returnArray;
      };

    recibirToken = async (id, username) => {
        console.log({"id": id, "username": username})
    const token = this.generarToken(id, username);   
    return { success: true, token };
};

generarToken = (id, username) => {
    const payload = {
        id: id,            
        username: username 
    };

    const secretKey = 'Mediafire>>>MEGA';
    const options = {
        expiresIn: "4 Hours",
        issuer: 'NoahDK06'
    };

    const token = jwt.sign(payload, secretKey, options); 
    return token;
}
}
