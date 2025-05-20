require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const expensesRoutes = require('./routes/expense.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
  origin: 'https://smart-spend-c2f8b.web.app', // URL de tu frontend en Firebase
  credentials: false
}));

// Middlewares
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado correctamente'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a Smart Spend Backend! 🚀');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expensesRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
