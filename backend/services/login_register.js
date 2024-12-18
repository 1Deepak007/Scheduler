const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/db").pool; // Get pool from database connection

const registerUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error("Invalid email or password"));
        } else {
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            reject(new Error("Invalid email or password"));
          } else {
            const token = jwt.sign(
              { userId: user.id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            resolve(token);
          }
        }
      }
    );
  });
};

module.exports = { registerUser, loginUser };
