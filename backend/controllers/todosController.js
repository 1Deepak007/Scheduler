const db = require("../db/db");
const authenticateToken = require("../middleware/authMiddleware");

// Get all ToDos of specific user                               api : http://localhost:3728/todos
function getTodos(req, res) {
  //   authenticateToken(req, res, () => {
  const query = "SELECT * FROM todos WHERE user_id = ?";
  // req.user.id <- getting user's id stored in jwt token
  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
    res.json(results);
  });
  //   });
}

// Add ToDo             api : http://localhost:3728/todos            test-data : { "title":"Coding", "description":"Code for 6 hours" }
function addTodo(req, res) {
  //   authenticateToken(req, res, () => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const query =
    "INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)";
  db.query(query, [req.user.id, title, description], (err) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    res.status(201).json({ message: "ToDo created successfully." });
  });
  //   });
}

// Update ToDo                    api : http://localhost:3728/todos/5    5(id of task)              data : {  "user_id": 1,  "title": "Walking",  "description": "Walk for 1 hours" }
function updateTodo(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  const query =
    "UPDATE todos SET title = ?, description = ? WHERE id = ? AND user_id = ?";
  db.query(query, [title, description, id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ToDo not found." });
    }
    res.json({ message: "ToDo updated successfully." });
  });
}

// Delete ToDo                        api : http://localhost:3728/todos/3                 3- todo id
function deleteTodo(req, res) {
  const { id } = req.params;

  const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
  db.query(query, [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ToDo not found." });
    }
    res.json({ message: "ToDo deleted successfully." });
  });
}

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
