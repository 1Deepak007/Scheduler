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

const loginUser = async (email, password, res) => {
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
              { userId: user.id, email: user.email },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              }
            );
            resolve({ token, user });
          }
          // res.status(200).json({
          //   success: true,
          //   data: {
          //     message: "User authenticated successfully",
          //     token: token,
          //     user: {
          //       id: user.id,
          //       email: user.email,
          //     },
          //   },
          // });
        }
      }
    );
  });
};

module.exports = { registerUser, loginUser };
