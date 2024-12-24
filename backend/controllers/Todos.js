const todosService = require("../services/todos");
const { authenticateToken } = require("../middleware/auth");

const createTodo = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.params.id;

  try {
    const newTodo = await todosService.createTodo(userId, title, description);
    res.status(201).json(newTodo);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Failed to create todo" });
  }
};

const getTodos = async (req, res) => {
  const userId = req.params.id;

  try {
    const todos = await todosService.getTodosByUser(userId);
    res.json(todos);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Failed to get todos" });
  }
};

const updateTodo = async (req, res) => {
  const todoId = req.params.todoId;
  const { title, description, status } = req.body;

  try {
    const updatedTodo = await todosService.updateTodo(
      todoId,
      title,
      description,
      status
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Failed to update todo" });
  }
};

const deleteTodo = async (req, res) => {
  const todoId = req.params.id;

  try {
    const deletedTodo = await todosService.deleteTodo(todoId);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
