import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { dbConfig } from '@/config/db.config';

let pool: Pool;

// Function to create schema if tables do not exist
async function createSchema() {
    const conn = await pool.getConnection();
    try {
        // Add CREATE TABLE IF NOT EXISTS statements for all tables
        await conn.query(`
            CREATE TABLE IF NOT EXISTS User (
                username VARCHAR(50) PRIMARY KEY,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(50) NOT NULL,
                surname VARCHAR(50) NOT NULL,
                nationality VARCHAR(50) NOT NULL
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Title (
                title_ID INT PRIMARY KEY,
                title_name VARCHAR(50) NOT NULL UNIQUE
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Player (
                username VARCHAR(50) PRIMARY KEY,
                date_of_birth DATE NOT NULL,
                elo_rating INT NOT NULL CHECK (elo_rating > 1000),
                fide_ID VARCHAR(20) NOT NULL UNIQUE,
                title_ID INT,
                FOREIGN KEY (username) REFERENCES User(username),
                FOREIGN KEY (title_ID) REFERENCES Title(title_ID)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Coach (
                username VARCHAR(50) PRIMARY KEY,
                FOREIGN KEY (username) REFERENCES User(username)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Arbiter (
                username VARCHAR(50) PRIMARY KEY,
                experience_level VARCHAR(20) NOT NULL,
                FOREIGN KEY (username) REFERENCES User(username)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Sponsor (
                sponsor_ID INT PRIMARY KEY,
                sponsor_name VARCHAR(50) NOT NULL UNIQUE
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Team (
                team_ID INT PRIMARY KEY,
                team_name VARCHAR(50) NOT NULL,
                coach_username VARCHAR(50) NOT NULL UNIQUE,
                contract_start DATE NOT NULL,
                contract_finish DATE NOT NULL,
                sponsor_ID INT NOT NULL,
                FOREIGN KEY (coach_username) REFERENCES Coach(username),
                FOREIGN KEY (sponsor_ID) REFERENCES Sponsor(sponsor_ID),
                CHECK (contract_finish > contract_start)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Specialty (
                specialty_name VARCHAR(50) PRIMARY KEY
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS CoachCertification (
                certification_name VARCHAR(50) PRIMARY KEY
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS ArbiterCertification (
                certification_name VARCHAR(50) PRIMARY KEY
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Hall (
                hall_ID INT PRIMARY KEY,
                hall_name VARCHAR(50) NOT NULL,
                hall_country VARCHAR(50) NOT NULL,
                hall_capacity INT NOT NULL CHECK (hall_capacity > 0)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS \`Table\`(
                hall_ID INT,
                table_ID INT,
                PRIMARY KEY (hall_ID, table_ID),
                FOREIGN KEY (hall_ID) REFERENCES Hall(hall_ID)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Tournament (
                tournament_ID INT PRIMARY KEY,
                tournament_name VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                format VARCHAR(20) NOT NULL,
                chief_arbiter_username VARCHAR(50) NOT NULL,
                FOREIGN KEY (chief_arbiter_username) REFERENCES Arbiter(username),
                CHECK (end_date >= start_date)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS ChessMatch (
                match_ID INT PRIMARY KEY,
                tournament_ID INT NOT NULL,
                hall_ID INT NOT NULL,
                table_ID INT NOT NULL,
                match_date DATE NOT NULL,
                start_slot INT NOT NULL CHECK (start_slot BETWEEN 1 AND 3),
                white_team_ID INT NOT NULL,
                white_player_username VARCHAR(50) NOT NULL,
                black_team_ID INT NOT NULL,
                black_player_username VARCHAR(50) NOT NULL,
                assigned_arbiter_username VARCHAR(50) NOT NULL,
                rating INT CHECK (rating BETWEEN 1 AND 10),
                result VARCHAR(10) NOT NULL,
                FOREIGN KEY (tournament_ID) REFERENCES Tournament(tournament_ID),
                FOREIGN KEY (hall_ID, table_ID) REFERENCES \`Table\` (hall_ID, table_ID),
                FOREIGN KEY (white_team_ID) REFERENCES Team(team_ID),
                FOREIGN KEY (white_player_username) REFERENCES Player(username),
                FOREIGN KEY (black_team_ID) REFERENCES Team(team_ID),
                FOREIGN KEY (black_player_username) REFERENCES Player(username),
                FOREIGN KEY (assigned_arbiter_username) REFERENCES Arbiter(username),
                CHECK (white_player_username != black_player_username),
                CHECK (white_team_ID != black_team_ID),
                CONSTRAINT unique_match_schedule UNIQUE (hall_ID, table_ID, match_date, start_slot)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Player_plays_for_Team (
                username VARCHAR(50),
                team_ID INT,
                PRIMARY KEY (username, team_ID),
                FOREIGN KEY (username) REFERENCES Player(username),
                FOREIGN KEY (team_ID) REFERENCES Team(team_ID)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Coach_has_specialty (
                username VARCHAR(50),
                specialty_name VARCHAR(50),
                PRIMARY KEY (username, specialty_name),
                FOREIGN KEY (username) REFERENCES Coach(username),
                FOREIGN KEY (specialty_name) REFERENCES Specialty(specialty_name)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Coach_has_certification (
                username VARCHAR(50),
                certification_name VARCHAR(50),
                PRIMARY KEY (username, certification_name),
                FOREIGN KEY (username) REFERENCES Coach(username),
                FOREIGN KEY (certification_name) REFERENCES CoachCertification(certification_name)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Arbiter_has_arbiter_cert (
                username VARCHAR(50),
                certification_name VARCHAR(50),
                PRIMARY KEY (username, certification_name),
                FOREIGN KEY (username) REFERENCES Arbiter(username),
                FOREIGN KEY (certification_name) REFERENCES ArbiterCertification(certification_name)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Tournament_held_in (
                tournament_ID INT,
                hall_ID INT,
                PRIMARY KEY (tournament_ID, hall_ID),
                FOREIGN KEY (tournament_ID) REFERENCES Tournament(tournament_ID),
                FOREIGN KEY (hall_ID) REFERENCES Hall(hall_ID)
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS Team_participates_in_Tournament (
                team_ID INT,
                tournament_ID INT,
                PRIMARY KEY (team_ID, tournament_ID),
                FOREIGN KEY (team_ID) REFERENCES Team(team_ID),
                FOREIGN KEY (tournament_ID) REFERENCES Tournament(tournament_ID)
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
