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

    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        socketTimeout: 3000,
        httpAgent: new Agent({ rejectUnauthorized: false }),
        httpsAgent: new Agent({ rejectUnauthorized: false }),
      }),
    });
  }

  async uploadFile(userId, key, fileBuffer, contentType) {
    try {
      // Prefijo basado en el userId o username
      const prefixedKey = `${userId}/${key}`; // Crea una "carpeta" con el nombre del usuario

      const params = {
        Bucket: this.bucketName,
        Key: prefixedKey, // Usamos el prefijo del usuario en la clave
        Body: fileBuffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.s3.config.region}.amazonaws.com/${prefixedKey}`;

      console.log('Archivo subido exitosamente:', data);
      return { data, fileUrl }; // Devolver también la URL pública
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      throw err;
    }
  }

  async eliminarArchivo(key) {
    try {
      if (!key) {
        throw new Error('No se proporcionó un key válido para eliminar el archivo.');
      }

      const params = {
        Bucket: this.bucketName,
        Key: key,
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
