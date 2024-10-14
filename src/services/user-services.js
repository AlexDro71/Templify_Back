import UsersRepository from '../repositories/user-repository.js';
import jwt from 'jsonwebtoken';

export default class UsersService {
    crearUsuario = async (nombre, apellido, username, password, mail, empresa) => {
        const repo = new UsersRepository();
        const returnArray = await repo.crearUsuario(nombre, apellido, username, password, mail, empresa);
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

    guardarArchivo = async (fileUrl, userId) => {
        const repo = new UsersRepository();
        const returnArray = await repo.guardarArchivo(fileUrl, userId);
        return returnArray;
    };

    obtenerArchivos = async (userId) => {
        const repo = new UsersRepository();
        const returnArray = await repo.obtenerArchivos(userId);
        return returnArray;
    };

    recibirToken = async (id, username) => {
        console.log("Datos recibidos para generar token:", { id, username });
        const token = this.generarToken(id, username);   
        console.log("Token in service: " + token)
        return { success: true, token };
    };

    generarToken = (id, username) => {
        console.log("id:", id);
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
