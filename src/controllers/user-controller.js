import s3 from '../../s3.js';
import express from 'express';
import UsersService from '../services/user-services.js';
import multer from 'multer';
import verifyToken from '../middlewares/auth-middleware.js'; // Importamos el middleware

const router = express.Router();
const usersService = new UsersService();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('files', 10); // Soporta múltiples archivos

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
      const user = await usersService.autenticarUsuario(username, password);
      if (user) {
        const token = await usersService.recibirToken(username, password);
        response.status(200).json({
          success: true,
          message: 'Inicio de sesión exitoso',
          token: token.token, 
          user: {
            id: user.id,
            username: user.username
          } 
        });
        console.log("Sesión iniciada correctamente");
      } else {
        response.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
    } catch (error) {
      console.error('Error durante el login', error);
      response.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta protegida
router.get('/profile', verifyToken, async (request, response) => {
    try {
      const userId = request.user.id; // Extraemos el ID del token verificado
      const userProfile = await usersService.getUserProfile(userId);
      response.status(200).json(userProfile);
    } catch (error) {
      console.error("Error al obtener el perfil", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.patch('/updateProfile', async (request, response) => {
    try {
      const { field, value, userId } = request.body;
      const updatedUser = await usersService.updateUserProfile(userId, field, value);
      response.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error al actualizar el perfil", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/sendSMS', async (request, response) => {
    try {
      const { phoneNumber, userId } = request.body;
      await usersService.sendSMSVerification(userId, phoneNumber);
      response.status(200).json({ message: "SMS enviado para verificación" });
    } catch (error) {
      console.error("Error al enviar SMS", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.patch("/seleccionarPdP", async (request, response) => {
    try {
      const { nombrePdP, precio, plazo, userId } = request.body;
      await usersService.seleccionarPdP(userId, nombrePdP, precio, plazo);
      response.status(200).json({ message: "Plan de Pago aplicado al usuario" });
    } catch (error) {
      console.error("Error al seleccionar el plan de pago", error);
      if (error.message === "El usuario ya tiene un plan de pago activo.") {
          return response.status(400).json({ message: error.message });
      }
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/crearPlantilla", async (request, response) => {
    try {
        // Lógica para crear plantilla
    } catch (error) {
        console.error("Error al crear plantilla", error);
        return response.status(500).json({ message: "Error interno del servidor" });
    }
});

// Subida de múltiples archivos
router.post("/cargarArchivos", upload, async (request, response) => {
  const files = request.files;
  if (!files || files.length === 0) {
    return response.status(400).json({ message: 'No se han enviado archivos' });
  }

  try {
    const data = await Promise.all(files.map(file => 
      s3.uploadFile(file.originalname, file.buffer, file.mimetype)
    ));
    response.status(200).json({ message: 'Archivos subidos exitosamente', data });
  } catch (error) {
    console.error("Error al cargar archivo", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/eliminarArchivos", async (request, response) => {
  const { key } = request.body;
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
