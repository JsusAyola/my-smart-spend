const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta para registrar usuario
router.post('/register', authController.register);

// Ruta para login de usuario
router.post('/login', authController.login);

// Ruta para obtener perfil de usuario
router.get('/me', authController.getProfile);

// Ruta para logout
router.post('/logout', authController.logout);

module.exports = router;
