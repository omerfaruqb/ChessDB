import dotenv from 'dotenv';
dotenv.config();

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chessdb',
};

// Create a .env file in your project root with these variables:
// DB_HOST=localhost
// DB_USER=your_username
// DB_PASSWORD=your_password
// DB_NAME=chessdb
