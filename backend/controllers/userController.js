const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// User registration         api : http://localhost:3728/register   // test-data (raw json):  { "username":"root","password":"root@123"  }
async function register(req, res) {
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
}

// User login               api : http://localhost:3728/login     //test-data (raw json): { "username":"root","password":"root@123"  }
async function login(req, res) {
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
}

// Logout
function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
}

module.exports = { register, login, logout };
