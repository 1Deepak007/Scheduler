const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const PORT = process.env.PORT || 6270;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Registration failed" });
        } else {
          res.status(201).json({ message: "Registration successful" });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Login failed" });
        } else if (results.length === 0) {
          res.status(401).json({ message: "Invalid email or password" });
        } else {
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            res.status(401).json({ message: "Invalid email or password" });
          } else {
            const token = jwt.sign(
              { userId: user.id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.json({ message: "Login successful", token });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  // Option 1: Invalidate session (if using sessions)
  // req.session.destroy((err) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Logout failed' });
  //   } else {
  //     res.clearCookie('session_id'); // Clear session cookie
  //     res.json({ message: 'Logged out successfully' });
  //   }
  // });

  // Option 2: Simply clear the token (JWT)
  res.clearCookie("token"); // Clear the token cookie
  res.json({ message: "Logged out successfully" });
});

// Protected Route (Example)
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have access to this resource" });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
