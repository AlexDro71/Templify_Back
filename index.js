import express from 'express';
import dotenv from 'dotenv';
import userController from './src/controllers/user-controller.js'; 
import cors from 'cors';
import pg from 'pg';
import { dbConfig } from './db.js';

const { Client } = pg;
const client = new Client(dbConfig);

client.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    client.end();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos', err);
  });

  
dotenv.config();
const PORT = process.env.PORT || 3033;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/front', express.static('public'));
app.use('/api/user', userController);

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
