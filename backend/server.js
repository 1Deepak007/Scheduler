const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = 3728;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "todos_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.get("/", (req, res) => {
  res.send(`Server is running on port http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// JWT secret
const JWT_SECRET = "hahaha_this_is_my_jwt_secret_@#!23$54";

// Helper function to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

// User registration         api : http://localhost:3728/register        test-data (raw json):  { "username":"root","password":"root@123"  }
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(query, [username, hashedPassword], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Username already exists." });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
    res.status(201).json({ message: "User registered successfully." });
  });
});

// User login               api : http://localhost:3728/login            test-data (raw json): { "username":"root","password":"root@123"  }
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found." });

    const user = results[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      // jwt storing id and username in encrypted form which you can't recognize in cookie
      // we can access it as ->  userId = req.user.id;
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful." });
  });
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
});

// Add ToDo             api : http://localhost:3728/todos            test-data : { "title":"Coding", "description":"Code for 6 hours" }
app.post("/todos", authenticateToken, (req, res) => {
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
});

// Get all ToDos of specific user                               api : http://localhost:3728/todos
app.get("/todos", authenticateToken, (req, res) => {
  const query = "SELECT * FROM todos WHERE user_id = ?";
  // req.user.id <- getting user's id stored in jwt token
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    res.json(results);
  });
});

// Update ToDo                    api : http://localhost:3728/todos/5    5(id of task)              data : {  "user_id": 1,  "title": "Walking",  "description": "Walk for 1 hours" }
app.put("/todos/:id", authenticateToken, (req, res) => {
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
});

// Delete ToDo                        api : http://localhost:3728/todos/3                 3- todo id
app.delete("/todos/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
  db.query(query, [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ToDo not found." });
    }
    res.json({ message: "ToDo deleted successfully." });
  });
});
