const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // 👈 Importa correcto

// Crear nuevo gasto
router.post('/', authMiddleware, expenseController.createExpense);

// Listar gastos
router.get('/', authMiddleware, expenseController.getUserExpenses);

// Eliminar gasto
router.delete('/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;
