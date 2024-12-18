const router = require("express").Router();
const authRoutes = require("./routes/auth_routes");
const todoRoutes = require("./routes/todo_routes");

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);

module.exports = router;
