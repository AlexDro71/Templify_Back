import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }
  
    const token = tokenHeader.split(' ')[1];  // Extrae solo el token sin "Bearer"
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'Mediafire>>>MEGA');
      req.user = decoded;  // Aquí deberías tener acceso al `id` y `username` del token
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  };
  
  export default verifyToken;
