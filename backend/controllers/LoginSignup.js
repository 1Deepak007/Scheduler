const { registerUser, loginUser } = require("../services/login_register");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
    // console.log(token);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Failed to log out" });
  }
};

module.exports = { register, login, logout };
