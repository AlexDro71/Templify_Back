import express from 'express';
import dotenv from 'dotenv';
import userController from './src/controllers/user-controller.js'; 
import cors from 'cors';
import pg from 'pg';
import { dbConfig } from './db.js';


const { Pool } = pg;
const pool = new Pool(dbConfig);

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

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
