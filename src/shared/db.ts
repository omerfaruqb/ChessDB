import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { dbConfig } from '@/config/db.config';

let pool: Pool;

// Function to create schema if tables do not exist
async function createSchema() {
    const conn = await pool.getConnection();
    try {
        // Add CREATE TABLE IF NOT EXISTS statements for all tables
        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                username VARCHAR(50) PRIMARY KEY,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(50) NOT NULL,
                surname VARCHAR(50) NOT NULL,
                nationality VARCHAR(50) NOT NULL,
                user_type ENUM('PLAYER', 'COACH', 'ARBITER', 'MANAGER') NOT NULL
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS titles (
                title_id INT PRIMARY KEY,
                title_name VARCHAR(50) NOT NULL UNIQUE
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS players (
                username VARCHAR(50) PRIMARY KEY,
                date_of_birth DATE NOT NULL,
                elo_rating INT NOT NULL CHECK (elo_rating > 1000),
                fide_id VARCHAR(20) NOT NULL UNIQUE,
                title_id INT,
                FOREIGN KEY (username) REFERENCES users(username),
                FOREIGN KEY (title_id) REFERENCES titles(title_id)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS coaches (
                username VARCHAR(50) PRIMARY KEY,
                FOREIGN KEY (username) REFERENCES users(username)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS arbiters (
                username VARCHAR(50) PRIMARY KEY,
                experience_level VARCHAR(20) NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS sponsors (
                sponsor_id INT PRIMARY KEY,
                sponsor_name VARCHAR(50) NOT NULL UNIQUE
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS teams (
                team_id INT PRIMARY KEY,
                team_name VARCHAR(50) NOT NULL,
                coach_username VARCHAR(50) NOT NULL UNIQUE,
                contract_start DATE NOT NULL,
                contract_finish DATE NOT NULL,
                sponsor_id INT NOT NULL,
                FOREIGN KEY (coach_username) REFERENCES coaches(username),
                FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id),
                CHECK (contract_finish > contract_start)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS specialties (
                specialty_name VARCHAR(50) PRIMARY KEY
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS coach_certifications (
                certification_name VARCHAR(50) PRIMARY KEY
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS arbiter_certifications (
                certification_name VARCHAR(50) PRIMARY KEY
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS halls (
                hall_id INT PRIMARY KEY,
                hall_name VARCHAR(50) NOT NULL,
                hall_country VARCHAR(50) NOT NULL,
                hall_capacity INT NOT NULL CHECK (hall_capacity > 0)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tables (
                hall_id INT,
                table_id INT,
                PRIMARY KEY (hall_id, table_id),
                FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tournaments (
                tournament_id INT PRIMARY KEY,
                tournament_name VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                format VARCHAR(20) NOT NULL,
                chief_arbiter_username VARCHAR(50) NOT NULL,
                FOREIGN KEY (chief_arbiter_username) REFERENCES arbiters(username),
                CHECK (end_date >= start_date)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS matches (
                match_id INT PRIMARY KEY,
                date DATE NOT NULL,
                time_slot INT NOT NULL CHECK (time_slot BETWEEN 1 AND 3),
                hall_id INT NOT NULL,
                table_id INT NOT NULL,
                team1_id INT NOT NULL,
                team2_id INT NOT NULL,
                white_player_id INT NOT NULL,
                black_player_id INT NOT NULL,
                arbiter_username VARCHAR(50) NOT NULL,
                rating INT CHECK (rating BETWEEN 1 AND 10),
                match_result ENUM('white_wins', 'black_wins', 'draw'),
                tournament_id INT,
                FOREIGN KEY (hall_id, table_id) REFERENCES tables(hall_id, table_id),
                FOREIGN KEY (team1_id) REFERENCES teams(team_id),
                FOREIGN KEY (team2_id) REFERENCES teams(team_id),
                FOREIGN KEY (arbiter_username) REFERENCES arbiters(username),
                FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
                CHECK (team1_id != team2_id),
                CONSTRAINT unique_match_schedule UNIQUE (hall_id, table_id, date, time_slot)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS player_teams (
                username VARCHAR(50),
                team_id INT,
                PRIMARY KEY (username, team_id),
                FOREIGN KEY (username) REFERENCES players(username),
                FOREIGN KEY (team_id) REFERENCES teams(team_id)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS coach_specialties (
                username VARCHAR(50),
                specialty_name VARCHAR(50),
                PRIMARY KEY (username, specialty_name),
                FOREIGN KEY (username) REFERENCES coaches(username),
                FOREIGN KEY (specialty_name) REFERENCES specialties(specialty_name)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS coach_has_certification (
                username VARCHAR(50),
                certification_name VARCHAR(50),
                PRIMARY KEY (username, certification_name),
                FOREIGN KEY (username) REFERENCES coaches(username),
                FOREIGN KEY (certification_name) REFERENCES coach_certifications(certification_name)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS arbiter_has_certification (
                username VARCHAR(50),
                certification_name VARCHAR(50),
                PRIMARY KEY (username, certification_name),
                FOREIGN KEY (username) REFERENCES arbiters(username),
                FOREIGN KEY (certification_name) REFERENCES arbiter_certifications(certification_name)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tournament_halls (
                tournament_id INT,
                hall_id INT,
                PRIMARY KEY (tournament_id, hall_id),
                FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
                FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS team_tournaments (
                team_id INT,
                tournament_id INT,
                PRIMARY KEY (team_id, tournament_id),
                FOREIGN KEY (team_id) REFERENCES teams(team_id),
                FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
            );
        `);
        console.log('Schema checked/created successfully');
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
