import 'dotenv/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Agent } from 'https';

class S3 {
  constructor() {
    // Inicializa el cliente de S3 con credenciales y región
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        socketTimeout: 3000,
        httpAgent: new Agent({ rejectUnauthorized: false }), // Acepta certificados auto-firmados
        httpsAgent: new Agent({ rejectUnauthorized: false }), // Acepta certificados auto-firmados
      }),
    });
  }

  async uploadFile(key, fileBuffer, contentType) {
    try {
      // Configura los parámetros de subida
      const params = {
        Bucket: process.env.S3_BUCKET_NAME, // Usa la variable de entorno para el nombre del bucket
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      };

      // Crea y envía el comando para subir el archivo
      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);

      console.log('Archivo subido exitosamente:', data);
      return data;
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      throw err;
    }
  }

  async eliminarArchivo(key) {
    try {
      // Asegúrate de que el key no esté vacío
      if (!key) {
        throw new Error('No se proporcionó un key válido para eliminar el archivo.');
      }

      // Configura los parámetros para eliminar el archivo
      const params = {
        Bucket: process.env.S3_BUCKET_NAME, // Usa la variable de entorno para el nombre del bucket
        Key: key,
      };

      // Crea y envía el comando para eliminar el archivo
      const command = new DeleteObjectCommand(params);
      const response = await this.s3.send(command);
      console.log('Archivo eliminado correctamente:', response);
      return response;
    } catch (err) {
      console.error('Error al eliminar el archivo:', err);
      throw err;
    }
  }
}

// Exporta una instancia de S3
const s3Instance = new S3();
export default s3Instance;
