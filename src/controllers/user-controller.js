import s3 from '../../s3.js';
import express from 'express';
import UsersService from '../services/user-services.js';
import multer from 'multer';

const router = express.Router();
const usersService = new UsersService();

// Define el almacenamiento en memoria para los archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", async (request, response) => {
    try {
        console.log("Datos recibidos:", request.body);
        const { nombre, apellido, username, password, mail, empresa } = request.body;
        const nuevoUser = await usersService.crearUsuario(nombre, apellido, username, password, mail, empresa);
        console.log("Usuario creado:", nuevoUser);
        response.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al crear usuario:", error.message);
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
          response.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
          console.log("Sesion iniciada correctamente");
      } else {
          response.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
  } catch (error) {
      console.error('Error durante el login', error);
      response.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/*Hacer*/ 
router.put("/editarUsuario", async (request, response) => {
    try {

        
    } catch (error) {
        console.error("Error al editar usuario", error);
        response.status(500).json({ message: "Error interno del servidor" });
    }
});

/*Hacer*/ 
router.patch("/seleccionarPdP", async (request, response) => {
    try {
        const user = request.user.id
        const PdP = request.body.PdP
        const func = await usersService.seleccionarPdP(user, PdP);
        response.status(200).json({message: "Plan de Pago aplicado al usuario"})

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
router.post("/cargarArchivos", upload.single('file'), async (request, response) => {
  const { key, contentType } = request.body;
  const file = request.file;

  if (!file) {
      return response.status(400).json({ message: 'No se ha enviado ningún archivo' });
  }

  try {
      const data = await s3.uploadFile(key, file.buffer, contentType);
      response.status(200).json({ message: 'Archivo subido exitosamente', data });
  } catch (error) {
      console.error("Error al cargar archivo", error);
      response.status(500).json({ message: "Error interno del servidor" });
  }
});

/*Probar*/ 
router.post("/eliminarArchivos", async (request, response) => {
  const { key } = request.body; // Solo necesitas el key para eliminar el archivo
  console.log("Datos recibidos:", request.body);

  try {
      if (!key) {
        return response.status(400).json({ message: 'No se proporcionó un key válido para eliminar el archivo.' });
      }

      const data = await s3.eliminarArchivo(key);
      response.status(200).json({ message: 'Archivo eliminado correctamente', data });
  } catch (error) {
      console.error("Error al eliminar archivo", error);
      response.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
