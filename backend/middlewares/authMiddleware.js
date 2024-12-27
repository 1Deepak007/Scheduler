const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' }); // More informative message
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            console.error("Token verification error:", err); // Log the error for debugging
            return res.status(403).json({ message: 'Invalid token' }); // More informative message
        }

        req.user = user;
        next();
    });
};


module.exports = authenticateToken;

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