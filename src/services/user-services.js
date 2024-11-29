import UsersRepository from '../repositories/user-repository.js';
import jwt from 'jsonwebtoken';
import s3 from '../../s3.js'; // Importamos el cliente S3 correctamente

export default class UsersService {
  constructor() {
    this.repo = new UsersRepository(); // Inicializamos el repositorio en el constructor
  }

  crearUsuario = async (nombre, apellido, username, password, mail, empresa) => {
    return await this.repo.crearUsuario(nombre, apellido, username, password, mail, empresa);
  };

  recibirUserId = async (username) => {
    return await this.repo.recibirUserId(username);
  };

  autenticarUsuario = async (username, password) => {
    return await this.repo.autenticarUsuario(username, password);
  };

  seleccionarPdP = async (user, nombrePdP, precio, plazo) => {
    return await this.repo.seleccionarPdP(user, nombrePdP, precio, plazo);
  };

  getUserProfile = async (username) => {
    return await this.repo.getUserProfile(username);
  };

  updateUserProfile = async (userId, field, value) => {
    return await this.repo.updateUserProfile(userId, field, value);
  };

  guardarArchivo = async (fileUrl, userId, fileName) => {
    console.log("Service: 'guardarArchivo' - Guardando archivo en la base de datos");
    return await this.repo.guardarArchivo(fileUrl, userId, fileName);
  };

  obtenerArchivos = async (userId) => {
    console.log("Service: obtenerArchivos - Iniciando");
    const archivos = await this.repo.obtenerArchivos(userId);
    console.log("Service: obtenerArchivos - Archivos obtenidos:", archivos);
    return archivos;
  };

  eliminarArchivoBD = async (archivoId) => {
    console.log("Service: 'eliminarArchivoBD' - Eliminando archivo de la base de datos");
    return await this.repo.eliminarArchivoBD(archivoId);
  };

  actualizarFotoPerfil = async (userId, fileUrl) => {
    console.log("Service: actualizarFotoPerfil - Iniciando");
    const result = await this.repo.actualizarFotoPerfil(userId, fileUrl);
    console.log("Service: actualizarFotoPerfil - Foto de perfil actualizada en la base de datos:", result);
    return result;
  };

  obtenerFotoPerfil = async (userId) => {
    console.log("Service: obtenerFotoPerfil - Iniciando proceso");
    const fotoPerfil = await this.repo.obtenerFotoPerfil(userId);
    console.log("Service: obtenerFotoPerfil - Foto de perfil obtenida:", fotoPerfil);
    return fotoPerfil;
  };

  eliminarFotoPerfilBD = async (userId) => {
    console.log("Service: eliminarFotoPerfilBD - Iniciando");
    const result = await this.repo.eliminarFotoPerfilBD(userId);
    console.log("Service: eliminarFotoPerfilBD - Foto de perfil eliminada de la base de datos:", result);
    return result;
  };

  obtenerTemplates = async (userId) => {
    console.log('Service: obtenerTemplates - Consultando repositorio');
    const templates = await this.repo.obtenerTemplates(userId);
    console.log('Service: obtenerTemplates - Templates obtenidos:', templates);
    return templates;
  };

  obtenerTemplatesPublicos = async () => {
    console.log('Service: obtenerTemplatesPublicos - Consultando repositorio');
    const templates = await this.repo.obtenerTemplatesPublicos();
    console.log('Service: obtenerTemplatesPublicos - Templates públicos obtenidos:', templates);
    return templates;
  };

  async crearTemplate(userId, nombre, linkTemplate) {
    console.log('Service: crearTemplate - Guardando template en la base de datos');
    const result = await this.repo.crearTemplate(userId, nombre, linkTemplate);
    return result.id; // Retorna el ID del nuevo template
  }

  async obtenerContenidoTemplate(templateId) {
    console.log('Service: obtenerContenidoTemplate - Iniciando proceso');
  
    // Obtener el template desde la base de datos
    const template = await this.repo.obtenerTemplatePorId(templateId);
    if (!template) {
      throw new Error('Template no encontrado en la base de datos');
    }
  
    console.log('Service: obtenerContenidoTemplate - Obteniendo contenido de S3');
  
    // Calcular el key relativo
    const bucketUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const s3Key = template.linktemplate.startsWith(bucketUrl)
      ? template.linktemplate.replace(bucketUrl, '') // Eliminar la URL base
      : template.linktemplate; // Si no coincide, usar el valor original
  
    console.log(`Service: obtenerContenidoTemplate - Key generado: ${s3Key}`);
  
    // Descargar contenido desde S3
    const content = await s3.obtenerArchivo(s3Key);
    return content;
  }
  

  recibirToken = async (id, username) => {
    console.log({ id, username });
    const token = this.generarToken(id, username);
    return { success: true, token };
  };

  generarToken = (id, username) => {
    const payload = {
      id: id,
      username: username,
    };

    const secretKey = 'Mediafire>>>MEGA';
    const options = {
      expiresIn: '4 Hours',
      issuer: 'NoahDK06',
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
  };
}
