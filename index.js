import express from 'express';
import dotenv from 'dotenv';
import userController from './src/controllers/user-controller.js';
import cors from 'cors';
const PORT = process.env.PORT
app.use(cors())
dotenv.config();

const app = express();
app.use(express.json());
app.use('/front', express.static('public'));
app.use('/api/user', userController);




app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});