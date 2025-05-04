// src/middlewares/auth.middleware.js
require('dotenv').config();      // si no lo hiciste en serve.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('⚠️  JWT_SECRET no está definido en .env (middleware)');
  process.exit(1);
}

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  console.log('→ Authorization header:', header);
  console.log('→ JWT_SECRET en middleware:', JWT_SECRET);

  const token = header?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token faltante.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error en el auth middleware:', error);
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
