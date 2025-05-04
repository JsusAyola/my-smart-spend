const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Registro y login
router.post('/register', authController.register);
router.post('/login',    authController.login);

// Obtener perfil (protegido)
router.get('/me', authMiddleware, authController.getProfile);

// ←←← Nueva ruta para actualizar perfil (protegido) ←←←
router.put('/me', authMiddleware, authController.updateProfile);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
