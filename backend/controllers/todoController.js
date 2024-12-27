const { connectToDatabase } = require('../config/db');

const todoController = {
    getTodos: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            const [todos] = await connection.execute('SELECT * FROM todos WHERE user_id = ?', [req.user.id]);
            res.json(todos);
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get todos' });
        }
    },

    createTodo: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            const { title, description, status } = req.body;
            const [result] = await connection.execute('INSERT INTO todos (user_id, title, description, status) VALUES (?, ?, ?, ?)', [req.user.id, title, description, status]);
            res.status(201).json({ message: 'Todo created', id: result.insertId });
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create todo' });
        }
    },

    updateTodo: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            const { title, description, status } = req.body;
            await connection.execute('UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?', [title, description, status, req.params.id, req.user.id]);
            res.json({ message: 'Todo updated' });
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update todo' });
        }
    },

    deleteTodo: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            await connection.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
            res.json({ message: 'Todo deleted' });
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete todo' });
        }
    }
};

module.exports = todoController;
