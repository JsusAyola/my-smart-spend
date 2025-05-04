const Expense = require('../models/Expense');

// 📌 Crear un nuevo gasto
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, emotion, date } = req.body;

    if (!title || !amount || !category || !emotion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const newExpense = new Expense({
      title,
      amount,
      category,
      emotion,
      date: date || Date.now(),
      userId: req.user.id // 👈 recuerda que authMiddleware agrega req.user
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
