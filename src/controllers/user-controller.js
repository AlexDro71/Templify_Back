import express from 'express';
import  usersService  from '../services/user-services.js';
import S3 from '../../s3.js'

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

/*Hacer*/      router.patch("/seleccionarPdP", async (request, response) => {
        try {

        }catch (error) {
          console.error("Error al seleccionar el plan de pago", error);
          return response.status(500).json({ message: "Error interno del servidor" });
        }
      })

/*Hacer*/      router.post("/crearPlantilla", async (request, response) => {
  try {

  }catch (error) {
    console.error("Error al crear plantilla", error);
    return response.status(500).json({ message: "Error interno del servidor" });
  }
})

/*Probar*/      router.post("/cargarArchivos", async (request, response) => {
  const bucketName = request.body.bucketName
  const key = request.body.key
  const filePath = request.body.filePath
  const contentType = request.body.contentType
  try {
    s3.uploadFile(bucketName, key, filePath, contentType)
    .then(data => {
      console.log('Upload successful:', data);
    })
    .catch(err => {
      console.error('Upload failed:', err);
    });
  }catch (error) {
    console.error("Error al cargar archivo", error);
    return response.status(500).json({ message: "Error interno del servidor" });
  }
})

/*Probar*/      router.post("/eliminarArchivos", async (request, response) => {
    const bucket = request.body.bucket; //El bucket se saca del propio codigo, arreglar despues :V
    const carpetaInternaBucket = request.body.carpetaInterna //Esto es la carpeta del usuario, se saca de la informacion de archivos del usuario
    
    
    const parametros = {
    Bucket: bucket,
    Key: carpetaInternaBucket
    }
    
    const eliminado = new DeleteObjectCommand(parametros);
    return S3.eliminarArchivo(eliminado);
    
    });
export default router;