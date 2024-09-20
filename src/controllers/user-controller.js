import s3 from '../../s3.js';
import express from 'express';
import UsersService from '../services/user-services.js';
import multer from 'multer';

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
        console.log("token in controller: " + token.token)
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

/*Hacer*/ 
router.patch("/editarUsuario", async (request, response) => {
    try {
        const {tabla, password, cambio} = request.body
        const user = request.user.id
        const nombre = request.user.username
        const cambiar = await usersService.editarUsuario(tabla, user, password, cambio, username)
        if(cambiar != null){
        response.status(200).json({ message: tabla + " ha sido actualizado correctamente" });
        }   
    } catch (error) {
        console.error("Error al editar usuario", error);
        response.status(500).json({ message: "Error interno del servidor" });
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
