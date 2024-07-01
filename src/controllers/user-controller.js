import express from 'express';
import  UsersService  from '../services/user-services.js';
const usersService = new UsersService();
const router = express.Router();

router.post("/register", async (request, response) => {
    try {
      const {nombre, apellido, username, password, mail, empresa} = request.body
      const nuevoUser = await usersService.crearUsuario(nombre, apellido, username, password, mail, empresa);
      response.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
      console.error("Error al crear algo", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }

  });

  router.get("/login", async (request, response) => {
    try {
        const {username, password} = request.body
      const login = await usersService.iniciarSesion(username, password); 
        return response.status(200).json({
          message: "Inicio correcto"
        });
    }
    catch (error) {
      console.error("Error al crear algo", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
  });

export default router;