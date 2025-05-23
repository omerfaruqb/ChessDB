-- Migration to fix password field length for bcrypt hashes
-- Bcrypt hashes are 60 characters long, so we need at least VARCHAR(60)
-- We'll use VARCHAR(255) to be safe for future password hashing algorithms

USE chessdb;

-- Alter the password field to accommodate bcrypt hashes
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- Verify the change
DESCRIBE users; 