-- TodoList Database Initialization Script
-- Run this script in your MySQL client

-- Create database
CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Insert sample data (optional)
-- Note: Password is hashed version of 'password123'
INSERT IGNORE INTO users (username, password) VALUES
('demo', '$2a$10$Pn7R4J9qY8Z1v2w3x4y5z6u7i8o9p0a1s2d3f4g5h6j7k8l9m0n1o2p');

INSERT IGNORE INTO todos (user_id, title, description, completed) VALUES
(1, 'Learn Vue 3', 'Study Vue 3 Composition API and new features', FALSE),
(1, 'Build TodoList App', 'Create a full-stack TodoList application', TRUE),
(1, 'Deploy to Production', 'Deploy the application to a cloud platform', FALSE);

-- Show table structure
DESCRIBE users;
DESCRIBE todos;

-- Show sample data
SELECT * FROM users;
SELECT * FROM todos;