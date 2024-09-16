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
        const user = await repo.autenticarUsuario(username, password);
        return user;
    }

    seleccionarPdP = async (user, PdP, nombrePdP, precio, plazoP) => {
        const repo = new UsersRepository();
        const returnArray = await repo.seleccionarPdP(user, PdP, nombrePdP, precio, plazoP);
        return returnArray;
    }

    editarUsuario = async (tabla, user, password, cambio, username) => {
        const repo = new UsersRepository();
        const returnArray = await repo.editarUsuario(tabla, user, password, cambio, username);
        return returnArray;
    }

    recibirToken = async (username, password) => {
        console.log("Datos recibidos para login:", { username, password });
        const repo = new UsersRepository();
        const validarUsuario = await repo.autenticarUsuario(username, password);
        console.log("Resultado de la autenticación:", validarUsuario);

        if (validarUsuario && validarUsuario.length > 0 && validarUsuario[0].id) {
            const token = this.generarToken(validarUsuario[0].id, validarUsuario[0].username);
            return { success: true, token }; // Asegúrate de devolver el token como una cadena
        } else {
            console.error("Usuario no encontrado o inválido");
            return { success: false, message: "Usuario no encontrado o inválido" };
        }
    }

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
        return token; // El token debería ser una cadena
    }
}
