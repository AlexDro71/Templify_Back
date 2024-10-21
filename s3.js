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
    this.region = 'us-east-2'; // Definir la región de manera explícita

    this.s3 = new S3Client({
      region: this.region,  // Configuramos la región de AWS S3
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
  async uploadFile(username, key, fileBuffer, contentType) {
    try {
      const prefixedKey = `${username}/${key}`; // Usamos el username en lugar del userId
      const params = {
        Bucket: this.bucketName,
        Key: prefixedKey, 
        Body: fileBuffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);

      // Formamos correctamente la URL del archivo
      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${prefixedKey}`;

      console.log('Archivo subido exitosamente:', data);
      return { data, fileUrl }; 
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      throw err;
    }
  }

  // Función para eliminar archivo de S3
  async eliminarArchivo(username, key) {
    try {
      if (!key) {
        throw new Error('No se proporcionó un key válido para eliminar el archivo.');
      }

      console.log("Intentando eliminar el archivo con Key:", key);

      const params = {
        Bucket: this.bucketName,
        Key: key,  // Usamos el key tal como viene de la URL del archivo
      };

      const command = new DeleteObjectCommand(params);
      const response = await this.s3.send(command);
      console.log('Archivo eliminado correctamente de S3:', response);
      return response;
    } catch (err) {
      console.error('Error al eliminar el archivo en S3:', err);
      throw err;
    }
  }
}

const s3Instance = new S3();
export default s3Instance;
