const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const expensesRoutes = require('./routes/expense.routes');
require('dotenv').config();  // Cargar las variables de entorno

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:4200',  // Dirección de tu Frontend Angular
  credentials: false  // Ya no estamos usando cookies, solo CORS
}));

// Middlewares
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/smart_spend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a Smart Spend Backend! 🚀');
});

// Rutas de autenticación y gastos
app.use('/auth', authRoutes);  // Rutas de autenticación
app.use('/expenses', expensesRoutes);  // Rutas de gastos

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
