import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

console.log(process.env.AWS_ACCESS_KEY_ID); 
console.log(process.env.AWS_SECRET_ACCESS_KEY); 

// Ignorar los certificados autofirmados
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configura el cliente S3 con el agente HTTPS
const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Ruta al archivo de la imagen
const filePath = path.join('./src/img/explosive-chick.png');
const fileContent = fs.readFileSync(filePath);

// Configura los parámetros de carga
const params = {
  Bucket: 'noah2',
  Key: 'user/explosive-chick.png',
  Body: fileContent,
  ContentType: 'image/png'
};

// Sube el archivo
async function uploadFile() {
  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log('Archivo subido exitosamente:', data);
  } catch (err) {
    console.error('Error al subir el archivo:', err);
  }
}

uploadFile();
