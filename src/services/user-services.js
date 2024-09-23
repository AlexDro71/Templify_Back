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
        const user = await repo.autenticarUsuario(username);
        if (user && user.password === password) { // Comparar directamente, ya que no se cifran contraseñas
            return user;
        }
        return null;
    }

    seleccionarPdP = async (user, nombrePdP, precio, plazo) => {
        const repo = new UsersRepository();
        const returnArray = await repo.seleccionarPdP(user, nombrePdP, precio, plazo);
        return returnArray;
    }

    getUserProfile = async (userId) => {
        const repo = new UsersRepository();
        const returnArray = await repo.getUserProfile(userId);
        return returnArray;
    };

    updateUserProfile = async (userId, field, value) => {
        const repo = new UsersRepository();
        const returnArray = await repo.updateUserProfile(userId, field, value);
        return returnArray;
    };

    recibirToken = async (id, username) => {
        console.log("Datos recibidos para generar token:", { id, username });
        const token = this.generarToken(id, username);
        return { success: true, token };
    };

    generarToken = (id, username) => {
        const payload = {
            id: id,
            username: username
        };

        const secretKey = process.env.JWT_SECRET_KEY || 'Mediafire>>>MEGA'; // Clave secreta desde .env
        const options = {
            expiresIn: "4 Hours",
            issuer: 'NoahDK06'
        };

        return jwt.sign(payload, secretKey, options);
    }
}
