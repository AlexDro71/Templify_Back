import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) {
    console.error('Error conectando a la base de datos:', error.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

export default connection;
