import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Configura el cliente S3
const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Ruta al archivo de la imagen (actualiza con la ruta correcta de tu archivo)
const filePath = path.join('./src/img/explosive-chick.png');
const fileContent = fs.readFileSync(filePath);

// Configura los parámetros de carga
const params = {
  Bucket: 'noah2',
  Key: 'explosive-chick.png',
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
