import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
    
    // Ignorar los certificados autofirmados
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
      return data;
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      throw err;
    }
  }

  async  eliminarArchivo(eliminado) {
  s3.send(eliminado).then(response =>{
  console.log(response);
  return res.status(200).json({mensaje: "archivo borrado correctamente"});
  })
}
}

export default S3;
