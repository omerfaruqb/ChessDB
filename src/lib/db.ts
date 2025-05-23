import mysql from 'mysql2/promise';

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chessdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// A simple wrapper around the MySQL pool to execute queries
const db = {
  query: async (sql: string, params?: any[]) => {
    try {
      return await pool.query(sql, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  // Add transaction support
  transaction: async (callback: (connection: mysql.PoolConnection) => Promise<any>) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

export default db; 