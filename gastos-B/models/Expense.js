const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Alimentación',
      'Transporte',
      'Salud',
      'Entretenimiento',
      'Educación',
      'Hogar',
      'Deudas',
      'Ahorro',
      'Otros'
    ]
  },
  emotion: {
    type: String,
    required: true,
    enum: [
      'Por obligación',
      'Por placer',
      'Por estrés o ansiedad',
      'Por metas',
      'Por presión social',
      'Por crecimiento personal'
    ]
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
