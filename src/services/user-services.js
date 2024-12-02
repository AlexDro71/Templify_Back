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
    
    // Llamar al repositorio para guardar en las tablas `plantilla` y `planxus`
    const templateId = await this.repo.crearTemplate(userId, nombre, linkTemplate);
    
    return templateId; // Retornar el ID del template creado
  }

  async obtenerContenidoTemplate(templateId) {
    console.log('Service: obtenerContenidoTemplate - Iniciando proceso');
  
    // Obtener el template desde la base de datos
    const template = await this.repo.obtenerTemplatePorId(templateId);
    if (!template) {
      throw new Error('Template no encontrado en la base de datos');
    }
  
    console.log('Service: obtenerContenidoTemplate - Obteniendo contenido de S3');
  
    // Extraer el key desde el linktemplate
    const s3Key = this.extraerKeyDesdeUrl(template.linktemplate);
  
    console.log(`Service: obtenerContenidoTemplate - Key generado: ${s3Key}`);
  
    // Descargar contenido desde S3
    const content = await s3.obtenerArchivo(s3Key);
    return content;
  }
  
  // Nueva función: extraerKeyDesdeUrl
  extraerKeyDesdeUrl(url) {
    try {
      const urlObj = new URL(url); // Analiza la URL
      let key = urlObj.pathname.substring(1); // Obtén el path después del "/"
      key = decodeURIComponent(key); // Decodifica caracteres especiales en la URL
      console.log(`Service: extraerKeyDesdeUrl - Key extraído: ${key}`);
      return key;
    } catch (error) {
      console.error('Service: extraerKeyDesdeUrl - Error al analizar la URL:', error);
      throw new Error('URL inválida para extraer el key.');
    }
  }
  
  actualizarTemplates = async (templateId) => {
    const templates = await this.repo.actualizarTemplates();
    return templates;
  };

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
