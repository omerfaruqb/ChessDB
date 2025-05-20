import { getDatabase } from './shared/db';

console.log('Initializing database...');

// This will trigger the database initialization synchronously when imported
const db = getDatabase();

console.log('Database initialization complete');

// Export the database instance for potential use in other files
export default db;
