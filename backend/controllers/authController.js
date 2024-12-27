const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../config/db');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, accessTokenSecret, { expiresIn: '2h' });
}

function generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, refreshTokenSecret);
}

const authController = {
    signup: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

            res.status(201).json({ message: 'User created', userId: result.insertId });
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },

    login: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            const { email, password } = req.body;

            const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (users.length === 0) return res.status(400).json({ message: 'No user found' });

            const user = users[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await connection.execute('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken]);

            // Set tokens as HttpOnly cookies
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

            res.json({ accessToken, refreshToken });
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Login failed' });
        }
    },


    logout: async (req, res) => {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to log out" });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const connection = await connectToDatabase();
            const { refreshToken } = req.body;
            if (!refreshToken) return res.sendStatus(401);

            const [tokens] = await connection.execute('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
            if (tokens.length === 0) return res.sendStatus(403);

            jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
                if (err) return res.sendStatus(403);
                const accessToken = generateAccessToken({ id: user.id });
                res.json({ accessToken });
            });
            await connection.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Token refresh failed' });
        }
    }
};

module.exports = authController;