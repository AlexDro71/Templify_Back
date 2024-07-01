import express from 'express';
import dotenv from 'dotenv';
import userController from './src/controllers/user-controller.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/front', express.static('public'));
app.use('/api/user', userController);

const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});