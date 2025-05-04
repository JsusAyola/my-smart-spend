// routes/expense.routes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware    = require('../middlewares/auth.middleware');

// Crear nuevo gasto
router.post('/', authMiddleware, expenseController.createExpense);

// Listar gastos del usuario logueado
router.get('/', authMiddleware, expenseController.getUserExpenses);

// ←––––––– Estas dos eran las que faltaban –––––––→
// Obtener un gasto por su ID
router.get('/:id', authMiddleware, expenseController.getExpenseById);

// Actualizar un gasto existente
router.put('/:id', authMiddleware, expenseController.updateExpense);

// Eliminar gasto
router.delete('/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;
