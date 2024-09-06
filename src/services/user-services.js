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
    seleccionarPdP = async (user, PdP) => {
        const repo = new UsersRepository();
        const returnArray = await repo.seleccionarPdP(user, PdP);
        return returnArray;
    }
    
    recibirToken = async (username, password) => {
        console.log("pasa")
        const repo = new UsersRepository();
        const validarUsuario = await repo.usuarioExiste(username, password); 
        console.log(validarUsuario)
        if(validarUsuario){
           const token = this.generarToken(validarUsuario[0].id, validarUsuario[0].username); 
           
            return token; 
        } else {
            return false;
        }
    }
    generarToken = async (id, username) =>{
        console.log("id:", id)
        const payload = {
            id: id,
            username: username
        }
        
        const secretKey = 'Mediafire>>>MEGA'
        
        const options = {
            expiresIn : "4 Hours",
            issuer : 'NoahDK06'
        }
        
        const token = jwt.sign(payload, secretKey, options)
    
        return token;
        }
}