import express from 'express';
import usersService from '../services/user-services.js';
import s3 from '../../s3.js';  // Importa la instancia de S3

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
      const {nombre, apellido, username, password, mail, empresa} = request.body;
      const nuevoUser = await usersService.crearUsuario(nombre, apellido, username, password, mail, empresa);
      response.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
      console.error("Error al crear algo", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/login", async (request, response) => {
    try {
        const {username, password} = request.body;
        const login = await usersService.recibirToken(username, password); 
        if (login) {
            return response.status(200).json({
              success: true,
              message: "Inicio correcto",
              token: login,
            });
        } else {
            response.status(401).json({
              success: false,
              message: "Usuario o clave invalida",
              token: "",
            });
        }
    } catch (error) {
      console.error("Error al crear algo", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Hacer*/ router.patch("/seleccionarPdP", async (request, response) => {
    try {
        // Lógica para seleccionar plan de pago
    } catch (error) {
      console.error("Error al seleccionar el plan de pago", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Hacer*/ router.post("/crearPlantilla", async (request, response) => {
  try {
      // Lógica para crear plantilla
  } catch (error) {
    console.error("Error al crear plantilla", error);
    return response.status(500).json({ message: "Error interno del servidor" });
  }
});

/*Probar*/ router.post("/cargarArchivos", async (request, response) => {
  const { bucketName, key, filePath, contentType } = request.body;
  try {
    const data = await s3.uploadFile(bucketName, key, filePath, contentType);
    response.status(200).json({ message: 'Archivo subido exitosamente', data });
  } catch (error) {
    console.error("Error al cargar archivo", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

/*Probar*/ router.post("/eliminarArchivos", async (request, response) => {
  const { bucketName, key } = request.body;
  try {
    const data = await s3.eliminarArchivo(bucketName, key);
    response.status(200).json({ message: 'Archivo eliminado correctamente', data });
  } catch (error) {
    console.error("Error al eliminar archivo", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
