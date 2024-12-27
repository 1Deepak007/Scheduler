const express = require('express');
const authController = require('../controllers/authController');
const todoController = require('../controllers/todoController');
const authenticateToken = require('../middlewares/authMiddleware');
// const jwt = require('jsonwebtoken');

const router = express.Router();


router.get('/', (req, res) => { res.send('Server is running.') })

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh_token', authController.refreshToken);

// Todo routes (protected)
router.get('/todos', authenticateToken, todoController.getTodos);
router.post('/todos', authenticateToken, todoController.createTodo);
router.put('/todos/:id', authenticateToken, todoController.updateTodo);
router.delete('/todos/:id', authenticateToken, todoController.deleteTodo);

module.exports = router;


// const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);

//     jwt.verify(token, accessTokenSecret, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// }
