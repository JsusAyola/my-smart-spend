const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Leer el token desde los encabezados (Authorization: Bearer <token>)
  const token = req.headers.authorization?.split(' ')[1]; // Asumimos el formato "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token faltante.' });
  }

  try {
    // Usa el JWT_SECRET desde las variables de entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifica el token
    req.user = decoded; // Almacena los datos del usuario en la solicitud
    next();  // Continúa con el siguiente middleware o ruta
  } catch (error) {
    console.error('Error en el auth middleware:', error);
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
