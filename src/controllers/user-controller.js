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
      mail: userProfile.mail,
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
    const { field, value } = request.body;
    const userId = request.user.id;

    const user = await usersService.updateUserProfile(userId, field, value);

    response.json({ message: `${field} actualizado correctamente`, user });
  } catch (error) {
    console.error("Error al actualizar el perfil", error);
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


router.post("/cargarArchivos", verifyToken, upload.single('file'), async (req, res) => {
  const { key } = req.body;
  const file = req.file;
  const username = req.user.username;
  const userId = req.user.id;

  if (!file) {
    console.error("Controller: 'cargarArchivos' - No se ha enviado ningún archivo");
    return res.status(400).json({ message: 'No se ha enviado ningún archivo.' });
  }

  try {
    console.log("Controller: 'cargarArchivos' - Procesando carga de archivo");
    const finalKey = key === 'profile' ? `${username}/profile` : `${username}/${key}`;
    const { fileUrl } = await s3.uploadFile(username, finalKey, file.buffer, file.mimetype);

    if (key === 'profile') {
      console.log("Controller: 'cargarArchivos' - Actualizando foto de perfil en la BD");
      await usersService.actualizarFotoPerfil(userId, fileUrl);
      return res.status(200).json({ message: 'Foto de perfil subida correctamente', fileUrl });
    } else {
      console.log("Controller: 'cargarArchivos' - Guardando archivo en la BD");
      const archivo = await usersService.guardarArchivo(fileUrl, userId, key);
      return res.status(200).json({ message: 'Archivo subido exitosamente', fileUrl, archivoId: archivo.id });
    }
  } catch (error) {
    console.error("Controller: 'cargarArchivos' - Error al cargar archivo", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});



router.get("/obtenerArchivos", verifyToken, async (req, res) => {
  const userId = req.user.id; 
  
  try {
    console.log("Controller: obtenerArchivos - Iniciando proceso de obtención de archivos");

  
    const archivos = await usersService.obtenerArchivos(userId);

    console.log("Controller: obtenerArchivos - Archivos obtenidos exitosamente", archivos);


    res.status(200).json({ archivos });
  } catch (error) {
    console.error("Controller: obtenerArchivos - Error al obtener archivos", error);
    res.status(500).json({ message: "Error interno al obtener archivos" });
  }
});

router.get("/obtenerFotoPerfil", verifyToken, async (req, res) => {
  const userId = req.user.id; // Obtener el ID del usuario desde el token

  try {
    console.log("Controller: obtenerFotoPerfil - Iniciando obtención de la foto de perfil");

    // Llamar al servicio para obtener la foto de perfil
    const fotoPerfil = await usersService.obtenerFotoPerfil(userId);

    console.log("Controller: obtenerFotoPerfil - Foto de perfil obtenida exitosamente", fotoPerfil);

    // Responder con el link de la foto de perfil
    res.status(200).json({ fotoperfil: fotoPerfil.fotoperfil });
  } catch (error) {
    console.error("Controller: obtenerFotoPerfil - Error al obtener foto de perfil", error);
    res.status(500).json({ message: "Error interno al obtener la foto de perfil" });
  }
});

// Eliminar archivo o foto de perfil
router.delete("/eliminarArchivo", verifyToken, async (req, res) => {
  const { idArchivo, linkArchivo } = req.body;

  try {
    console.log("Controller: eliminarArchivo - Iniciando proceso de eliminación de archivo");

    // Verificar que `linkArchivo` esté definido y extraer el `key`
    if (!linkArchivo) {
      return res.status(400).json({ message: 'linkArchivo no proporcionado' });
    }
    const key = linkArchivo;

    await s3.eliminarArchivo(key);
    await usersService.eliminarArchivoBD(idArchivo);

    console.log("Controller: eliminarArchivo - Archivo eliminado correctamente");
    res.status(200).json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error("Controller: eliminarArchivo - Error al eliminar archivo", error);
    res.status(500).json({ message: "Error interno al eliminar archivo" });
  }
});

router.post("/eliminarFotoPerfil", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const username = req.user.username;  // Extraer el nombre de usuario del token

  try {
    console.log("Controller: eliminarFotoPerfil - Iniciando proceso de eliminación de foto de perfil en S3");

    // Llamar a la función en s3.js para eliminar el archivo usando el username
    await s3.eliminarFDP(username);

    // Eliminar el enlace de la foto de perfil en la base de datos
    await usersService.eliminarFotoPerfilBD(userId);

    console.log("Controller: eliminarFotoPerfil - Foto de perfil eliminada correctamente de la BD y S3");
    res.status(200).json({ message: 'Foto de perfil eliminada correctamente' });
  } catch (error) {
    console.error("Controller: eliminarFotoPerfil - Error al eliminar foto de perfil", error);
    res.status(500).json({ message: "Error interno al eliminar la foto de perfil" });
  }
});

router.get('/obtenerTemplates', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    console.log('Controller: obtenerTemplates - Iniciando obtención de archivos');
    const archivos = await usersService.obtenerTemplates(userId);
    console.log('Controller: obtenerTemplates - Archivos obtenidos exitosamente:', archivos);

    res.status(200).json({ archivos });
  } catch (error) {
    console.error('Controller: obtenerTemplates - Error al obtener archivos:', error);
    res.status(500).json({ message: 'Error interno al obtener archivos' });
  }
});

router.get('/obtenerTemplatesPublicos', async (req, res) => {
  try {
    console.log('Controller: obtenerTemplatesPublicos - Iniciando consulta de templates públicos');
    const templatesPublicos = await usersService.obtenerTemplatesPublicos();
    console.log('Controller: obtenerTemplatesPublicos - Templates públicos obtenidos:', templatesPublicos);

    res.status(200).json({ templates: templatesPublicos });
  } catch (error) {
    console.error('Controller: obtenerTemplatesPublicos - Error:', error);
    res.status(500).json({ message: 'Error al obtener templates públicos' });
  }
});

  // Crear un nuevo template personal
  router.post('/crearTemplate', verifyToken, async (req, res) => {
    const { nombre } = req.body;
    const userId = req.user.id;
    const username = req.user.username;
  
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del template es obligatorio.' });
    }
  
    try {
      console.log('Controller: crearTemplate - Iniciando creación del template');
  
      // Crear el archivo en AWS S3
      const linkTemplate = `${username}/${nombre.replace(/\s+/g, '_')}.html`;
      await s3.uploadFile(
        username,
        linkTemplate,
        Buffer.from('<!DOCTYPE html><html><body></body></html>', 'utf8'),
        'text/html'
      );
  
      // Guardar en la base de datos
      const templateId = await usersService.crearTemplate(userId, nombre, `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${linkTemplate}`);
  
      console.log('Controller: crearTemplate - Template creado con éxito:', templateId);
      res.status(201).json({ templateId });
    } catch (error) {
      console.error('Controller: crearTemplate - Error al crear template:', error);
      res.status(500).json({ message: 'Error interno al crear template' });
    }
  });
  

  router.get('/obtenerContenidoTemplate/:id', verifyToken, async (req, res) => {
    const templateId = req.params.id;
  
    try {
      console.log('Controller: obtenerContenidoTemplate - Iniciando proceso');
      const content = await usersService.obtenerContenidoTemplate(templateId);
      console.log('Controller: obtenerContenidoTemplate - Contenido obtenido correctamente');
      res.status(200).json({ content });
    } catch (error) {
      console.error('Controller: obtenerContenidoTemplate - Error al obtener contenido:', error);
      res.status(500).json({ message: 'Error al obtener el contenido del template' });
    }
  });


export default router;
