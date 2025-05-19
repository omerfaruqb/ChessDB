import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { dbConfig } from '../config/db.config.js';

let pool: Pool;

export async function initDatabase() {
    if (pool) return pool;
    
    try {
        pool = createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            namedPlaceholders: true,
            timezone: 'Z',
            dateStrings: true
        });

        // Test the connection
        const conn = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        
        // Create tables if they don't exist
        await conn.query(`
            CREATE TABLE IF NOT EXISTS halls (
                hall_id INT AUTO_INCREMENT PRIMARY KEY,
                hall_name VARCHAR(255) NOT NULL,
                country VARCHAR(100) NOT NULL,
                capacity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        conn.release();
        console.log('Database tables verified/created');
        return pool;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

export function getDatabase() {
    if (!pool) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return pool;
}

export async function closeDatabase() {
    if (pool) {
        await pool.end();
    }
}

export async function withTransaction<T>(callback: (conn: PoolConnection) => Promise<T>): Promise<T> {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    
    try {
        const result = await callback(conn);
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}
