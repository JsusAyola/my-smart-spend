const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Configuración de seguridad
const JWT_SECRET = process.env.JWT_SECRET;  
if (!JWT_SECRET) {
  console.error('⚠️  JWT_SECRET no está definido en .env');
  process.exit(1);
}
const JWT_EXPIRES_IN = '7d'; // Tiempo de expiración del token

// 📌 Registrar un nuevo usuario
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, income, goal, documentType, documentNumber, phone } = req.body;

  // Validación de campos con express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }

  try {
    // Validación de fortaleza de la contraseña (mínimo 8 caracteres, al menos una mayúscula, un número y un símbolo)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo.'
      });
    }

    // Validación de número de teléfono (solo números y debe tener 10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'El número de teléfono debe tener 10 dígitos.'
      });
    }

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya está registrado',
        field: 'email'
      });
    }

    // Verificar que el número de documento de identidad no esté vacío
    if (!documentNumber) {
      return res.status(400).json({
        success: false,
        message: 'El número de documento es obligatorio.',
        field: 'documentNumber'
      });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      income: income || null,
      goal: goal || null,
      documentType,
      documentNumber,
      phone,
      plan: 'free'
    });

    // Guardar en MongoDB
    await newUser.save();

    // Crear token JWT para auto-login después del registro
    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } // Token expirará en 7 días
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,  // El token generado
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        income: newUser.income,
        goal: newUser.goal,
        documentType: newUser.documentType,
        documentNumber: newUser.documentNumber,
        phone: newUser.phone,
         plan: newUser.plan
      }
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al registrar.',
    });
  }
};

// 📌 Iniciar sesión de un usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }  // Usamos la misma variable de expiración del token
    );

    // Enviar la respuesta con el token y los datos del usuario
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token: token,  // El token generado
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        income: user.income,
        goal: user.goal,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al iniciar sesión.',
    });
  }
};

// 📌 Cerrar sesión
exports.logout = (req, res) => {
  // Elimina el token del localStorage (en el frontend se debe hacer en el cliente)
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
};

// 📌 Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    // Aquí, asumimos que el token viene en el header de Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener perfil.',
    });
  }
};
// 📌 Actualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    // ID del usuario extraído del token por authMiddleware
    const userId = req.user.id;

    // Campos permitidos a actualizar
    const allowed = ['firstName','lastName','income','goal','phone'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Actualizamos y devolvemos el usuario sin password ni __v
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, select: '-password -__v' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al actualizar perfil.'
    });
  }
};

// 📌 Actualizar el plan del usuario
exports.updateUserPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, subscription } = req.body;

    if (!['free', 'student', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Plan no válido.' });
    }

    if (!['monthly', 'annual'].includes(subscription)) {
      return res.status(400).json({ message: 'Tipo de suscripción no válido.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { plan, subscription },
      { new: true, select: '-password -__v' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      message: 'Plan actualizado exitosamente.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error actualizando el plan:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el plan.' });
  }
};