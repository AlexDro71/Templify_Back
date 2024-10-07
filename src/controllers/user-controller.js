import s3 from '../../s3.js';
import express from 'express';
import UsersService from '../services/user-services.js';
import multer from 'multer';
import verifyToken from '../middlewares/auth-middleware.js'; // Importa el middleware de autenticación

const router = express.Router();
const usersService = new UsersService();

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
    const user = await usersService.autenticarUsuario(username, password);
    if (user) {
      const token = await usersService.recibirToken(username, password);
      console.log("token in controller: " + token.token);
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

// Rutas protegidas con verifyToken
router.get('/profile', verifyToken, async (request, response) => {
    try {
      const userId = request.user.id; // Obtenemos el id del usuario autenticado
      const userProfile = await usersService.getUserProfile(userId);
      response.json({
        nombre: userProfile.nombre,
        correo: userProfile.mail,
        empresa: userProfile.empresa,
        plan: userProfile.plan,
        telefono: userProfile.telefono,
      });
    } catch (error) {
      console.error("Error al obtener el perfil", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.patch('/updateProfile', verifyToken, async (request, response) => {
  try {
    const { field, value, password } = request.body;
    const userId = request.user.id; // Obtenemos el id del usuario autenticado
    const user = await usersService.getUserProfile(userId);

    user[field] = value;
    await user.save();

    response.json({ message: `${field} actualizado correctamente` });
  } catch (error) {
    console.error("Error al actualizar el perfil", error);
    return response.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post('/sendSMS', verifyToken, async (request, response) => {
    try {
      const { phoneNumber } = request.body;
      const userId = request.user.id; // Obtenemos el id del usuario autenticado
      await usersService.sendSMSVerification(userId, phoneNumber);
      response.status(200).json({ message: "SMS enviado para verificación" });
    } catch (error) {
      console.error("Error al enviar SMS", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.patch("/seleccionarPdP", verifyToken, async (request, response) => {
    try {
      const { nombrePdP, precio, plazo } = request.body;
      const userId = request.user.id; // Obtenemos el id del usuario autenticado
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

router.post("/crearPlantilla", verifyToken, async (request, response) => {
    try {
        // Lógica para crear plantilla
    } catch (error) {
        console.error("Error al crear plantilla", error);
        return response.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/cargarArchivos", verifyToken, upload.single('file'), async (request, response) => {
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

router.post("/eliminarArchivos", verifyToken, async (request, response) => {
  const { key } = request.body;
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
