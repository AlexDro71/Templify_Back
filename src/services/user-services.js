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
        const repo = new UsersRepository();
        const returnArray = await repo.guardarArchivo(fileUrl, userId, fileName);
        return returnArray;
    };

    obtenerArchivos = async (userId) => {
        const repo = new UsersRepository();
        const returnArray = await repo.obtenerArchivos(userId);
        return returnArray;
    };

    eliminarArchivoBD = async (archivoId) => {
        const repo = new UsersRepository();
        const returnArray = await repo.eliminarArchivoBD(archivoId);
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
