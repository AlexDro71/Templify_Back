import 'dotenv/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Agent } from 'https';

class S3 {
  constructor() {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('No se proporcionó un nombre de bucket válido.');
    }

    this.bucketName = bucketName;
    this.region = process.env.AWS_REGION || 'us-east-2';

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 300000,
        socketTimeout: 300000,
        httpsAgent: new Agent({
          rejectUnauthorized: false,
        }),
      }),
      maxAttempts: 5,
    });
  }

  /**
   * Subir un archivo a S3
   * @param {string} username - Nombre del usuario o carpeta raíz.
   * @param {string} key - Key completa del archivo (path dentro del bucket).
   * @param {Buffer} fileBuffer - Contenido del archivo.
   * @param {string} contentType - Tipo MIME del archivo.
   * @returns {string} URL del archivo subido.
   */
  async uploadFile(username, key, fileBuffer, contentType) {
    try {
      console.log("S3 Service: 'uploadFile' - Subiendo archivo a S3");

      // Evitar duplicar el nombre de usuario en el key
      const prefixedKey = key.startsWith(`${username}/`) ? key : `${username}/${key}`;
      const params = {
        Bucket: this.bucketName,
        Key: prefixedKey,
        Body: fileBuffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${prefixedKey}`;
      console.log("S3 Service: 'uploadFile' - Archivo subido exitosamente:", { fileUrl });
      return fileUrl;
    } catch (err) {
      console.error("S3 Service: 'uploadFile' - Error al subir el archivo:", err);
      throw err;
    }
  }

  /**
   * Obtener el contenido de un archivo desde S3
   * @param {string} key - Key completa del archivo dentro del bucket.
   * @returns {string} Contenido del archivo como string.
   */
  async obtenerArchivo(key) {
    try {
      console.log(`S3 Service: 'obtenerArchivo' - Descargando archivo con key: ${key}`);
  
      const params = {
        Bucket: this.bucketName,
        Key: key, // Usamos solo el key relativo
      };
  
      const command = new GetObjectCommand(params);
      const response = await this.s3.send(command);
  
      // Convertir el stream a string
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('error', reject);
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        });
  
      const content = await streamToString(response.Body);
      console.log('S3 Service: "obtenerArchivo" - Archivo descargado correctamente');
      return content;
    } catch (error) {
      console.error('S3 Service: "obtenerArchivo" - Error al obtener archivo:', error);
      throw error;
    }
  }
  

  /**
   * Eliminar un archivo de S3
   * @param {string} key - Key completa del archivo dentro del bucket.
   * @returns {Object} Respuesta de la operación de eliminación.
   */
  async eliminarArchivo(key) {
    try {
      console.log("S3 Service: 'eliminarArchivo' - Eliminando archivo en S3 con key:", key);

      if (!key) {
        throw new Error('No se proporcionó un key válido para eliminar el archivo.');
      }

      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      const command = new DeleteObjectCommand(params);
      const response = await this.s3.send(command);

      console.log("S3 Service: 'eliminarArchivo' - Archivo eliminado correctamente de S3:", response);
      return response;
    } catch (err) {
      console.error("S3 Service: 'eliminarArchivo' - Error al eliminar el archivo en S3:", err);
      throw err;
    }
  }
}

export default new S3();
