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

    router.post("/login", async (request, response) => {
        try {
            const {username, password} = request.body
          const login = await usersService.recibirToken(username, password); 
          if (login) {
            return response.status(200).json({
              succes: true,
              message: "Inicio correcto",
              token: login,
            });
          } else {
            response.status(401).json({
              succes: false,
              message: "Usuario o clave invalida",
              token: "",
            });
          }
        } catch (error) {
          console.error("Error al crear algo", error);
          return response.status(500).json({ message: "Error interno del servidor" });
        }
      });

export default router;