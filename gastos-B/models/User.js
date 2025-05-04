const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {  // Cambié "nombres" a "firstName"
    type: String,
    required: true,
    trim: true,
    match: [/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, 'The name can only contain letters and spaces'] // Validación de letras y espacios
  },
  lastName: {  // Cambié "apellidos" a "lastName"
    type: String,
    required: true,
    trim: true,
    match: [/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, 'The last name can only contain letters and spaces'] // Validación de letras y espacios
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/,
      'Please enter a valid email address (Gmail, Outlook, Yahoo, Hotmail)'
    ], // Validación de dominio de correo
  },
  password: {
    type: String,
    required: true
  },
  income: {
    type: String,
    default: ''
  },
  goal: {
    type: String,
    default: ''
  },
  documentType: {  // Cambié "documentType" en español
    type: String,
    required: true,
    enum: [
      'CC',           // Cédula de ciudadanía
      'CE',           // Cédula de extranjería
      'PASSPORT',     // Pasaporte
      'RUT',          // RUT
      'ID_CARD',      // Tarjeta de Identidad
      'NIT'           // NIT
    ]
  },
  documentNumber: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'The phone number must be a 10-digit number'] // Validación de teléfono de 10 dígitos
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
