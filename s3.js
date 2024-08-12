import 'dotenv/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

class S3 {
  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  async uploadFile(bucketName, key, filePath, contentType) {
    try {
      const fileContent = fs.readFileSync(path.resolve(filePath));
      
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);
      
      console.log('Archivo subido exitosamente:', data);
      return data.location;
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      throw err;
    }
  }

  async eliminarArchivo(bucketName, key) {
    try {
      const parametros = {
        Bucket: bucketName,
        Key: key
      };
    
      const eliminado = new DeleteObjectCommand(parametros);
      const response = await this.s3.send(eliminado);
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