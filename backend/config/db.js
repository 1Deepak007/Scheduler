const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');
        return connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

module.exports = { connectToDatabase };