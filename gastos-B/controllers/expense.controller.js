const Expense = require('../models/Expense');

// 📌 Crear un nuevo gasto
exports.createExpense = async (req, res) => {
  try {
    const user = req.user; // Usuario autenticado

    // Definir límites por plan
    const MAX_EXPENSES = {
      free: 3,
      student: 10,
      premium: Infinity
    };

    // Obtener el número de gastos actuales del usuario
    const expenseCount = await Expense.countDocuments({ userId: user.id });

    // Verificar límite según el plan
    const userLimit = MAX_EXPENSES[user.plan] ?? 3;

    if (expenseCount >= userLimit) {
      return res.status(403).json({
        message: `Has alcanzado el límite de gastos (${userLimit}) para el plan ${user.plan}.`
      });
    }

    // Validar los datos recibidos
    const { title, amount, category, emotion, date } = req.body;

    if (!title || !amount || !category || !emotion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Crear nuevo gasto
    const newExpense = new Expense({
      title,
      amount,
      category,
      emotion,
      date: date || Date.now(),
      userId: user.id
    });

    await newExpense.save();

    res.status(201).json({ message: 'Gasto creado exitosamente.', expense: newExpense });

  } catch (error) {
    console.error('Error creando gasto:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};


// 📌 Listar gastos del usuario logueado
exports.getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error listando gastos:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// 📌 Eliminar gasto por ID
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado.' });
    }

    res.status(200).json({ message: 'Gasto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error eliminando gasto:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
// 📌 Obtener un gasto por ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado.' });
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error('Error obteniendo gasto:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { title, amount, category, emotion, date } = req.body;

    // Aquí iría la lógica para actualizar el gasto
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, userId: req.user.id },
      { title, amount, category, emotion, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    res.status(200).json({ message: 'Gasto actualizado exitosamente', expense: updatedExpense });
  } catch (error) {
    console.error('Error actualizando gasto:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el gasto' });
  }
};
