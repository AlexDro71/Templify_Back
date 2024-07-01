import UsersRepository from '../repositories/user-repository.js';


export default class UsersService {
    crearUsuario = async (nombre, apellido, username, password, mail, empresa) => {
        const repo = new UsersRepository();
        const returnArray = await repo.crearUsuario(nombre, apellido, username, password, mail, empresa);
        return returnArray;
    }
    iniciarSesion = async (username, password) => {
        const repo = new UsersRepository();
        const returnArray = await repo.iniciarSesion(username, password);
        return returnArray;
    }
}