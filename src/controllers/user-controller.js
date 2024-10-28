import s3 from '../../s3.js';
import express from 'express';
import UsersService from '../services/user-services.js';
import multer from 'multer';
import verifyToken from '../middlewares/auth-middleware.js'; // Importa el middleware de autenticación

const router = express.Router();
const usersService = new UsersService();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, username, password, mail, empresa } = req.body;

    const nuevoUsuario = await usersService.crearUsuario(nombre, apellido, username, password, mail, empresa);

    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    if (error.message === 'El nombre de usuario ya está en uso') {
      return res.status(409).json({ message: error.message });
    }
    
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    const userId = await usersService.recibirUserId(username);
    const user = await usersService.autenticarUsuario(username, password);
    if (user) {
      const token = await usersService.recibirToken(userId, username);
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
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extraemos el ID del usuario desde el token

    if (!userId) {
      return res.status(400).json({ message: "ID de usuario no válido." });
    }

    // Llama al servicio para obtener el perfil del usuario basado en el ID
    const userProfile = await usersService.getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      username: userProfile.username,  // Agregamos el username aquí
      nombre: userProfile.nombre,
      apellido: userProfile.apellido,
      correo: userProfile.mail,
      empresa: userProfile.empresa,
      plan: userProfile.plan_nombre,
      telefono: userProfile.telefono,
    });
  } catch (error) {
    console.error("Error al obtener el perfil", error);
    return res.status(500).json({ message: "Error interno del servidor" });
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

// Subir archivo, incluyendo la foto de perfil
// Subir archivo, incluyendo la foto de perfil
// Cargar archivo o foto de perfil
router.post("/cargarArchivos", verifyToken, upload.single('file'), async (req, res) => {
  const { key } = req.body;
  const file = req.file;
  const username = req.user.username;
  const userId = req.user.id;

  if (!file) {
    return res.status(400).json({ message: 'No se ha enviado ningún archivo.' });
  }

  try {
    const finalKey = key === 'profile' ? `${username}/profile` : `${username}/${key}`;
    const { fileUrl } = await s3.uploadFile(username, finalKey, file.buffer, file.mimetype);

    if (key === 'profile') {
      // Actualiza la URL de la foto de perfil en la tabla `usuario`
      await usersService.actualizarFotoPerfil(userId, fileUrl);
      return res.status(200).json({ message: 'Foto de perfil subida correctamente', fileUrl });
    } else {
      // Guarda archivo en la tabla `archivos`
      const archivo = await usersService.guardarArchivo(fileUrl, userId, key);
      return res.status(200).json({ message: 'Archivo subido exitosamente', fileUrl, archivoId: archivo.id });
    }
  } catch (error) {
    console.error("Error al cargar archivo", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});


// Obtener archivos o la foto de perfil
router.post("/obtenerArchivos", verifyToken, async (request, response) => {
  const userId = request.user.id;
  const { key } = request.body;

  try {
    if (key === 'profile') {
      // Obtener el link de la foto de perfil desde la tabla `usuario`
      const fotoperfil = await usersService.obtenerFotoPerfil(userId);
      return fotoperfil ? response.status(200).json({ fotoperfil }) : response.status(404).json({ message: 'Sin foto de perfil.' });
    }

    // Obtener todos los archivos del usuario en la tabla `archivos`
    const archivos = await usersService.obtenerArchivos(userId);
    response.status(200).json({ archivos });
  } catch (error) {
    console.error("Error al obtener archivo", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar archivo o foto de perfil
router.post("/eliminarArchivos", verifyToken, async (request, response) => {
  const { idArchivo, linkArchivo } = request.body;
  const username = request.user.username;

  try {
    const key = linkArchivo.split('.amazonaws.com/')[1];
    await s3.eliminarArchivo(username, key);

    if (idArchivo) {
      // Eliminar un archivo normal en la tabla `archivos`
      await usersService.eliminarArchivoBD(idArchivo);
      response.status(200).json({ message: 'Archivo eliminado correctamente' });
    } else {
      response.status(400).json({ message: 'ID de archivo no proporcionado' });
    }
  } catch (error) {
    console.error("Error al eliminar archivo", error);
    response.status(500).json({ message: "Error interno del servidor al eliminar archivo" });
  }
});

export default router;
