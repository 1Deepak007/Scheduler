const router = require("express").Router();
const todosController = require("../../controllers/Todos");
const { authenticateToken } = require("../../middleware/auth");

// Add a To-Do item
router.post("/:id", authenticateToken, todosController.createTodo);

// Update a To-Do item (can be used for marking complete, working, or pending)
router.put("/:todoId", authenticateToken, todosController.updateTodo);

// Delete a To-Do item
router.delete("/:id", authenticateToken, todosController.deleteTodo);

// Get all To-Do items for the current user
router.get("/:id", authenticateToken, todosController.getTodos);

module.exports = router;
