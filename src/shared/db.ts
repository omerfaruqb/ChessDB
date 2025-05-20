import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { dbConfig } from '@/config/db.config';

let pool: Pool;

// Function to create schema if tables do not exist
async function createSchema() {
    const conn = await pool.getConnection();
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Read the SQL file
        const sqlFilePath = path.join(__dirname, '../..', 'db_init.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        
        // Split the SQL file into individual statements
        const sqlStatements: string[] = sqlContent
            .split(';')
            .filter((statement: string) => statement.trim().length > 0);
        
        // Execute each statement
        for (const statement of sqlStatements) {
            await conn.query(statement.trim());
        }
        
        console.log('Schema checked/created successfully');
    } catch (error) {
        console.error('Error creating schema:', error);
        throw error;
    } finally {
        conn.release();
    }
}

// Initialize database asynchronously
async function initializeDatabase() {
    if (pool) return pool;
    try {
        pool = createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            namedPlaceholders: true,
            timezone: 'Z',
            dateStrings: true,
            connectTimeout: 10000
        });
        // Test the connection
        const conn = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        conn.release();
        // Create schema if needed
        await createSchema();
        return pool;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

// Immediately initialize the database
initializeDatabase();

export function getDatabase(): Pool {
    if (!pool) {
        throw new Error('Database not initialized');
    }
    return pool;
}

export async function closeDatabase() {
    if (pool) {
        await pool.end();
        console.log('Database connection closed');
    }
}

export async function withTransaction<T>(
    callback: (conn: PoolConnection) => Promise<T>
): Promise<T> {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
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
