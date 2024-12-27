Register api : POST : http://localhost:6270/auth/register     { "name":"root1", "email":"root1@gmail.com",  "password":"root@123" }
Login api : POST : http://localhost:6270/login          { "email":"root@gmail.com", "password":"root@123"   }
Refresh Token(gives another access token) : http://localhost:6270/refresh_token     raw json (refresh token received in login): {"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM1MjQzMDI4fQ.Ad1I3EeZoKtduOGnJw0Hr5IXSRFvqZk3WVvvRCd4YTo"}
Add Todo api : POST : http://localhost:6270/todos      In Auth select Bearer token and put there the value of token you got when you logged-in.  {   "title" : "Gym at 8",   "description" : "Go to gym", "status": "pending"  }
Update Todo by todo id : PUT : http://localhost:6270/todos/3  3(todo's id)    { "title": "Gym at 7",  "description": "I have to go to gym at 7 in morning", "status": "completed"}
Delete Todo by too id : DELETE : http://localhost:6270/todos/4   4(todo's id)
Get all Todos of a user : GET : http://localhost:6270/todos







CREATE TABLE users (   
    id INT AUTO_INCREMENT PRIMARY KEY,   
    name VARCHAR(255) NOT NULL,   
    email VARCHAR(255) UNIQUE NOT NULL,   
    password VARCHAR(255) NOT NULL 
);

CREATE TABLE todos (   
    id INT AUTO_INCREMENT PRIMARY KEY,   
    user_id INT,   
    title VARCHAR(255),   
    description TEXT,   
    status ENUM('pending', 'working', 'completed'),   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,   
    FOREIGN KEY (user_id) REFERENCES users(id) 
);

CREATE TABLE refresh_tokens (   
    id INT AUTO_INCREMENT PRIMARY KEY,   
    user_id INT,   
    token TEXT,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    FOREIGN KEY (user_id) REFERENCES users(id) 
);