import 'dotenv/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Agent } from 'https';

class S3 {
  constructor() {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('No se proporcionó un nombre de bucket válido. Asegúrate de definir la variable S3_BUCKET_NAME en el archivo .env.');
    }

    this.bucketName = bucketName;

    // Configuramos el cliente S3 para que ignore los certificados autofirmados
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 300000,
        socketTimeout: 300000,
        httpsAgent: new Agent({
          rejectUnauthorized: false,  // Ignorar certificados autofirmados
        }),
      }),
      maxAttempts: 5,  // Incrementa el número de intentos
    });
  }

  // Función para subir archivo a S3
  async uploadFile(userId, key, fileBuffer, contentType) {
    try {
      const prefixedKey = `${userId}/${key}`; // Carpeta basada en el userId
      const params = {
        Bucket: this.bucketName,
        Key: prefixedKey, 
        Body: fileBuffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.s3.config.region}.amazonaws.com/${prefixedKey}`;

      console.log('Archivo subido exitosamente:', data);
      return { data, fileUrl }; 
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      throw err;
    }
  }

  // Función para eliminar archivo de S3
  async eliminarArchivo(userId, key) {
    try {
      if (!key) {
        throw new Error('No se proporcionó un key válido para eliminar el archivo.');
      }

      const prefixedKey = `${userId}/${key}`; // Usar el prefijo del usuario para eliminar el archivo correcto
      const params = {
        Bucket: this.bucketName,
        Key: prefixedKey,
      };

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

const s3Instance = new S3();
export default s3Instance;
