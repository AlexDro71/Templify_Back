import express from "express"
require('dotenv').config();

const app = express
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});