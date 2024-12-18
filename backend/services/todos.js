const pool = require("../db/db").pool;

// create a todo by user's id
const createTodo = async (userId, title, description) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO todos (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [userId, title, description, "pending"],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
};

// get todos by user's id
const getTodosByUser = async (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM todos WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error("Todo not found"));
        } else {
          resolve(results);
        }
      }
    );
  });
};

// update by id of a todo
const updateTodo = async (todoId, title, description, status) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description, status, todoId],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
};

// delete by id of a todo
const deleteTodo = async (todoId) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM todos WHERE id = ?", [todoId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
};

module.exports = {
  createTodo,
  getTodosByUser,
  updateTodo,
  deleteTodo,
};
