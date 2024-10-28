import 'dotenv/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Agent } from 'https';

class S3 {
  constructor() {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('No se proporcionó un nombre de bucket válido.');
    }

    this.bucketName = bucketName;
    this.region = 'us-east-2';

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

  // Subir archivo a S3
  async uploadFile(username, key, fileBuffer, contentType) {
    try {
      console.log("S3 Service: 'uploadFile' - Subiendo archivo a S3");

      const prefixedKey = key === 'profile' ? `${username}/profile` : key.startsWith(username) ? key : `${username}/${key}`;
      const params = {
        Bucket: this.bucketName,
        Key: prefixedKey,
        Body: fileBuffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);
      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${prefixedKey}`;

      console.log("S3 Service: 'uploadFile' - Archivo subido exitosamente:", { fileUrl });
      return { data, fileUrl };
    } catch (err) {
      console.error("S3 Service: 'uploadFile' - Error al subir el archivo:", err);
      throw err;
    }
  }

  // Eliminar archivo de S3
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

const s3Instance = new S3();
export default s3Instance;
