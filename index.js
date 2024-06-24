import express from 'express';
import dotenv from 'dotenv';
import connection from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
  if (err) throw err;
  console.log('La solución es: ', results[0].solution);
  connection.end();
});
