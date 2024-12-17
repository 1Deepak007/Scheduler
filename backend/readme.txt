npm i express mysql2 bcrypt jsonwebtoken cookie-parser nodemon  

// SQL Queries for Creating Database and Tables
/**
 * CREATE DATABASE todos_db;
 * USE todos_db;
 * CREATE TABLE users (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     username VARCHAR(255) UNIQUE NOT NULL,
 *     password VARCHAR(255) NOT NULL
 * );
 * CREATE TABLE todos (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     user_id INT NOT NULL,
 *     title VARCHAR(255) NOT NULL,
 *     description TEXT,
 *     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
 * );
 */

// Instructions for testing APIs in Postman
/**
 * 1. Register a user:
 *    POST http://localhost:3000/register
 *    Body (JSON): { "username": "user1", "password": "password123" }
 *
 * 2. Login:
 *    POST http://localhost:3000/login
 *    Body (JSON): { "username": "user1", "password": "password123" }
 *    Save the cookie returned in the response.
 *
 * 3. Add ToDo:
 *    POST http://localhost:3000/todos
 *    Body (JSON): { "title": "First Task", "description": "Complete the project" }
 *    Use the saved cookie for authentication.
 *
 * 4. Get ToDos:
 *    GET http://localhost:3000/todos
 *    Use the saved cookie for authentication.
 *
 * 5. Update ToDo:
 *    PUT http://localhost:3000/todos/:id
 *    Body (JSON): { "title": "Updated Task", "description": "Updated description" }
 *    Use the saved cookie for authentication.
 *
 * 6. Delete ToDo:
 *    DELETE http://localhost:3000/todos/:id
 *    Use the saved cookie for authentication.
 *
 * 7. Logout:
 *    POST http://localhost:3000/logout
 */

