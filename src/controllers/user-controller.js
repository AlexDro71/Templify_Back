import s3 from '../../s3.js';
import express from 'express';
import UsersService from '../services/user-services.js';

const router = express.Router();
const usersService = new UsersService();

router.post("/register", async (request, response) => {
    try {
        console.log("Datos recibidos:", request.body);
        const { nombre, apellido, username, password, mail, empresa } = request.body;
        const nuevoUser = await usersService.crearUsuario(nombre, apellido, username, password, mail, empresa);
        console.log("Usuario creado:", nuevoUser);
        response.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al crear usuario:", error.message);  // Solo el mensaje de error
        response.status(500).json({ message: "Error interno del servidor" });
    }
});


router.post("/login", async (request, response) => {
  try {
      const { username, password } = request.body;
      console.log("Datos recibidos para login:", request.body);

      // Reemplazar esta línea con la lógica adecuada de autenticación
      const user = await usersService.autenticarUsuario(username, password);

      if (user) {
          // Lógica de token comentada por ahora
          // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          response.status(200).json({ success: true, message: 'Inicio de sesión exitoso' /*, token */ });
      console.log("Sesion iniciada correctamente")
        } else {
          response.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
  } catch (error) {
      console.error('Error durante el login', error);
      response.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/*Hacer*/ 
router.put("/editarUsuario", async (request, response) => {  // Corregido
    try {
        
    } catch (error) {
        console.error("Error al editar usuario", error);
        response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Hacer*/ 
router.patch("/seleccionarPdP", async (request, response) => {
    try {
        
    } catch (error) {
        console.error("Error al seleccionar el plan de pago", error);
        return response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Hacer*/ 
router.post("/crearPlantilla", async (request, response) => {
    try {
        
    } catch (error) {
        console.error("Error al crear plantilla", error);
        return response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Probar*/ 
router.post("/cargarArchivos", async (request, response) => {
    const {key, filePath, contentType } = request.body;
    try {
        const data = await s3.uploadFile(key, filePath, contentType);
        response.status(200).json({ message: 'Archivo subido exitosamente', data });
    } catch (error) {
        console.error("Error al cargar archivo", error);
        response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Probar*/ 
router.post("/eliminarArchivos", async (request, response) => {
    const key = request.body;
    try {
        const data = await s3.eliminarArchivo(bucketName, key);
        response.status(200).json({ message: 'Archivo eliminado correctamente', data });
    } catch (error) {
        console.error("Error al eliminar archivo", error);
        response.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;
