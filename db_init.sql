-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS team_tournaments;
DROP TABLE IF EXISTS tournament_halls;
DROP TABLE IF EXISTS arbiter_has_certification;
DROP TABLE IF EXISTS coach_has_certification;
DROP TABLE IF EXISTS coach_specialties;
DROP TABLE IF EXISTS player_teams;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS halls;
DROP TABLE IF EXISTS arbiter_certifications;
DROP TABLE IF EXISTS coach_certifications;
DROP TABLE IF EXISTS specialties;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS arbiters;
DROP TABLE IF EXISTS coaches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS titles;
DROP TABLE IF EXISTS users;

-- Then follow with your CREATE TABLE statements
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    surname VARCHAR(50),
    nationality VARCHAR(50),
    user_type ENUM('PLAYER', 'COACH', 'ARBITER', 'MANAGER') NOT NULL
);

CREATE TABLE IF NOT EXISTS titles (
    title_id INT PRIMARY KEY,
    title_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS players (
    username VARCHAR(50) PRIMARY KEY,
    date_of_birth DATE NOT NULL,
    elo_rating INT NOT NULL CHECK (elo_rating > 1000),
    fide_id VARCHAR(20) NOT NULL UNIQUE,
    title_id INT,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (title_id) REFERENCES titles(title_id)
);

CREATE TABLE IF NOT EXISTS coaches (
    username VARCHAR(50) PRIMARY KEY,
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS arbiters (
    username VARCHAR(50) PRIMARY KEY,
    experience_level VARCHAR(20) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS sponsors (
    sponsor_id INT PRIMARY KEY,
    sponsor_name VARCHAR(50) NOT NULL UNIQUE
);

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

CREATE TABLE IF NOT EXISTS specialties (
    specialty_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS coach_certifications (
    certification_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS arbiter_certifications (
    certification_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS halls (
    hall_id INT PRIMARY KEY,
    hall_name VARCHAR(50) NOT NULL,
    hall_country VARCHAR(50) NOT NULL,
    hall_capacity INT NOT NULL CHECK (hall_capacity > 0)
);

CREATE TABLE IF NOT EXISTS tables (
    hall_id INT,
    table_id INT,
    PRIMARY KEY (hall_id, table_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

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

CREATE TABLE IF NOT EXISTS matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    time_slot INT NOT NULL CHECK (time_slot BETWEEN 1 AND 3),
    hall_id INT NOT NULL,
    table_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    white_player_username VARCHAR(50) NOT NULL,
    black_player_username VARCHAR(50) NOT NULL,
    arbiter_username VARCHAR(50) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 10),
    match_result ENUM('white_wins', 'black_wins', 'draw'),
    tournament_id INT,
    FOREIGN KEY (hall_id, table_id) REFERENCES tables(hall_id, table_id),
    FOREIGN KEY (team1_id) REFERENCES teams(team_id),
    FOREIGN KEY (team2_id) REFERENCES teams(team_id),
    FOREIGN KEY (white_player_username) REFERENCES players(username),
    FOREIGN KEY (black_player_username) REFERENCES players(username),
    FOREIGN KEY (arbiter_username) REFERENCES arbiters(username),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    CHECK (team1_id != team2_id),
    CONSTRAINT unique_match_schedule UNIQUE (hall_id, table_id, date, time_slot)
);

CREATE TABLE IF NOT EXISTS player_teams (
    username VARCHAR(50),
    team_id INT,
    PRIMARY KEY (username, team_id),
    FOREIGN KEY (username) REFERENCES players(username),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE IF NOT EXISTS coach_specialties (
    username VARCHAR(50),
    specialty_name VARCHAR(50),
    PRIMARY KEY (username, specialty_name),
    FOREIGN KEY (username) REFERENCES coaches(username),
    FOREIGN KEY (specialty_name) REFERENCES specialties(specialty_name)
);

CREATE TABLE IF NOT EXISTS coach_has_certification (
    username VARCHAR(50),
    certification_name VARCHAR(50),
    PRIMARY KEY (username, certification_name),
    FOREIGN KEY (username) REFERENCES coaches(username),
    FOREIGN KEY (certification_name) REFERENCES coach_certifications(certification_name)
);

CREATE TABLE IF NOT EXISTS arbiter_has_certification (
    username VARCHAR(50),
    certification_name VARCHAR(50),
    PRIMARY KEY (username, certification_name),
    FOREIGN KEY (username) REFERENCES arbiters(username),
    FOREIGN KEY (certification_name) REFERENCES arbiter_certifications(certification_name)
);

CREATE TABLE IF NOT EXISTS tournament_halls (
    tournament_id INT,
    hall_id INT,
    PRIMARY KEY (tournament_id, hall_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

CREATE TABLE IF NOT EXISTS team_tournaments (
    team_id INT,
    tournament_id INT,
    PRIMARY KEY (team_id, tournament_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
); 

SET foreign_key_checks = 0;
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('kevin', 'K3v!n#2024', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('bob', 'Bob@Secure88', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('admin1', 326593, NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('jessica', 'secretpw.33#', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('admin2', 'admin2pw', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('fatima', 'F4tima!DBmngr', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('yusuf', 'Yu$ufSecure1', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('maria', 'M@r1a321', NULL, NULL, NULL, 'MANAGER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('alice', 'Pass@123', 'Alice', 'Smith', 'USA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('bob1', 'Bob@2023', 'Bob', 'Jones', 'UK', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('clara', 'Clara#21', 'Clara', 'Kim', 'KOR', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('david', 'D@vid2024', 'David', 'Chen', 'CAN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('emma', 'Emm@9win', 'Emma', 'Rossi', 'ITA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('felix', 'F3lix$88', 'Felix', 'Novak', 'GER', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('grace', 'Gr@ce2025', 'Grace', 'Ali', 'TUR', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('henry', 'Hen!ry777', 'Henry', 'Patel', 'IND', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('isabel', 'Isa#Blue', 'Isabel', 'Lopez', 'MEX', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('jack', 'Jack@321', 'Jack', 'Brown', 'USA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('kara', 'Kara$99', 'Kara', 'Singh', 'IND', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('liam', 'Li@mChess', 'Liam', 'Müller', 'GER', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('mia', 'M!a2020', 'Mia', 'Wang', 'CHN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('noah', 'Noah#44', 'Noah', 'Evans', 'CAN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('olivia', 'Oliv@99', 'Olivia', 'Taylor', 'UK', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('peter', 'P3ter!1', 'Peter', 'Dubois', 'FRA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('quinn', 'Quinn%x', 'Quinn', 'Ma', 'CHN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('rachel', 'Rach3l@', 'Rachel', 'Silva', 'BRA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('sam', 'S@mWise', 'Sam', 'O''Neill', 'IRE', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('tina', 'T!naChess', 'Tina', 'Zhou', 'KOR', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('umar', 'Umar$22', 'Umar', 'Haddad', 'UAE', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('vera', 'V3ra#21', 'Vera', 'Nowak', 'POL', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('will', 'Will@321', 'Will', 'Johnson', 'AUS', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('xena', 'Xena$!', 'Xena', 'Popov', 'RUS', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('yusuff', 'Yusuf88@', 'Yusuf', 'Demir', 'TUR', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('zoe', 'Zo3!pass', 'Zoe', 'Tanaka', 'JPN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('hakan', 'H@kan44', 'Hakan', 'Şimşek', 'TUR', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('julia', 'J!ulia77', 'Julia', 'Nilsen', 'SWE', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('mehmet', 'Mehmet#1', 'Mehmet', 'Yıldız', 'TUR', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('elena', 'El3na@pw', 'Elena', 'Kuznetsova', 'RUS', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('nina', 'Nina@2024', 'Nina', 'Martinez', 'ESP', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('louis', 'Louis#88', 'Louis', 'Schneider', 'GER', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('sofia', 'Sofia$22', 'Sofia', 'Russo', 'ITA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('ryan', 'Ryan@77', 'Ryan', 'Edwards', 'USA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('claire', 'Claire#01', 'Claire', 'Dupont', 'FRA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('jacob', 'Jacob!pass', 'Jacob', 'Green', 'AUS', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('ava', 'Ava@Chess', 'Ava', 'Kowalski', 'POL', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('ethan', 'Ethan$win', 'Ethan', 'Yamamoto', 'JPN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('isabella', 'Isabella#77', 'Isabella', 'Moretti', 'ITA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('logan', 'Logan@55', 'Logan', 'O''Connor', 'IRL', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('sophia', 'Sophia$12', 'Sophia', 'Weber', 'GER', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('lucas', 'Lucas!88', 'Lucas', 'Novak', 'CZE', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('harper', 'Harper@pw', 'Harper', 'Clarke', 'UK', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('jamess', 'James!44', 'James', 'Silva', 'BRA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('amelia', 'Amelia#99', 'Amelia', 'Zhang', 'CHN', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('benjamin', 'Ben@2023', 'Benjamin', 'Fischer', 'GER', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('ella', 'Ella@pw', 'Ella', 'Svensson', 'SWE', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('alex', 'Alex$88', 'Alex', 'Dimitrov', 'BUL', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('lily', 'Lily@sun', 'Lily', 'Nakamura', 'USA', 'PLAYER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('carol', 'coachpw', 'Carol', 'White', 'Canada', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('david_b', 'dPass!99', 'David', 'Brown', 'USA', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('emma_green', 'E@mma77', 'Emma', 'Green', 'UK', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('fatih', 'FatihC21', 'Fatih', 'Ceylan', 'Turkey', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('hana', 'Hana$45', 'Hana', 'Yamada', 'Japan', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('lucaas', 'Lucas#1', 'Lucas', 'Müller', 'Germany', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('mia_rose', 'Mia!888', 'Mia', 'Rossi', 'Italy', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('onur', 'onUr@32', 'Onur', 'Kaya', 'Turkey', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('sofia_lop', 'S0fia#', 'Sofia', 'López', 'Spain', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('arslan_yusuf', 'Yusuf199', 'Yusuf', 'Arslan', 'Turkey', 'COACH');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('erin', 'arbpw', 'Erin', 'Gray', 'Germany', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('mark', 'refpass', 'Mark', 'Blake', 'USA', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('lucy', 'arb123', 'Lucy', 'Wang', 'China', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('ahmet', 'pass2024', 'Ahmet', 'Yılmaz', 'Turkey', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('ana', 'secretpw', 'Ana', 'Costa', 'Brazil', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('james', 'secure1', 'James', 'Taylor', 'UK', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('sara', 'sara!2024', 'Sara', 'Kim', 'South Korea', 'ARBITER');
INSERT INTO users (username, password, name, surname, nationality, user_type) VALUES ('mohamed', 'mpass', 'Mohamed', 'Farouk', 'Egypt', 'ARBITER');
INSERT INTO titles (title_id, title_name) VALUES (1, 'Grandmaster');
INSERT INTO titles (title_id, title_name) VALUES (2, 'International Master');
INSERT INTO titles (title_id, title_name) VALUES (3, 'FIDE Master');
INSERT INTO titles (title_id, title_name) VALUES (4, 'Candidate Master');
INSERT INTO titles (title_id, title_name) VALUES (5, 'National Master');
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('alice', '2000-10-05', 2200, 'FIDE001', 1);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('bob1', '1998-07-21', 2100, 'FIDE002', 5);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('clara', '2001-03-15', 2300, 'FIDE003', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('david', '1997-02-12', 2050, 'FIDE004', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('emma', '1999-06-19', 2250, 'FIDE005', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('felix', '2002-04-09', 2180, 'FIDE006', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('grace', '2000-12-08', 2320, 'FIDE007', 1);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('henry', '1998-04-25', 2150, 'FIDE008', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('isabel', '2001-02-17', 2240, 'FIDE009', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('jack', '1997-11-30', 2000, 'FIDE010', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('kara', '2003-07-01', 2350, 'FIDE011', 5);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('liam', '1999-05-23', 2200, 'FIDE012', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('mia', '2002-12-14', 2125, 'FIDE013', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('noah', '1996-08-08', 2400, 'FIDE014', 1);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('olivia', '2001-03-06', 2280, 'FIDE015', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('peter', '2000-11-10', 2140, 'FIDE016', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('quinn', '1998-09-16', 2210, 'FIDE017', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('rachel', '1999-06-07', 2290, 'FIDE018', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('sam', '2002-01-29', 2100, 'FIDE019', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('tina', '2003-03-13', 2230, 'FIDE020', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('umar', '1997-01-11', 2165, 'FIDE021', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('vera', '2001-04-22', 2260, 'FIDE022', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('will', '2000-06-18', 2195, 'FIDE023', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('xena', '1998-09-02', 2330, 'FIDE024', 1);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('yusuff', '1999-12-26', 2170, 'FIDE025', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('zoe', '2001-05-05', 2220, 'FIDE026', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('hakan', '1997-10-14', 2110, 'FIDE027', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('julia', '2002-02-03', 2300, 'FIDE028', 1);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('mehmet', '1998-07-31', 2080, 'FIDE029', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('elena', '2000-09-24', 2345, 'FIDE030', 1);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('nina', '2001-12-07', 2150, 'FIDE031', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('louis', '1998-08-11', 2100, 'FIDE032', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('sofia', '2000-02-17', 2250, 'FIDE033', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('ryan', '1997-02-09', 2170, 'FIDE034', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('claire', '2002-11-01', 2225, 'FIDE035', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('jacob', '1999-10-20', 2120, 'FIDE036', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('ava', '2003-04-05', 2300, 'FIDE037', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('ethan', '1998-03-25', 2190, 'FIDE038', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('isabella', '2001-08-19', 2240, 'FIDE039', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('logan', '1997-04-14', 2115, 'FIDE040', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('sophia', '2000-01-06', 2280, 'FIDE041', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('lucas', '1999-12-30', 2145, 'FIDE042', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('harper', '2002-06-07', 2200, 'FIDE043', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('jamess', '1998-03-21', 2155, 'FIDE044', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('amelia', '2001-09-09', 2275, 'FIDE045', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('benjamin', '1997-01-27', 2095, 'FIDE046', 4);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('ella', '2000-03-11', 2235, 'FIDE047', 2);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('alex', '1999-05-22', 2180, 'FIDE048', 3);
INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) VALUES ('lily', '2003-12-02', 2310, 'FIDE049', 2);
INSERT INTO coaches (username) VALUES ('carol');
INSERT INTO coaches (username) VALUES ('david_b');
INSERT INTO coaches (username) VALUES ('emma_green');
INSERT INTO coaches (username) VALUES ('fatih');
INSERT INTO coaches (username) VALUES ('hana');
INSERT INTO coaches (username) VALUES ('lucaas');
INSERT INTO coaches (username) VALUES ('mia_rose');
INSERT INTO coaches (username) VALUES ('onur');
INSERT INTO coaches (username) VALUES ('sofia_lop');
INSERT INTO coaches (username) VALUES ('arslan_yusuf');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (100, 'ChessVision');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (101, 'Grandmaster Corp');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (102, 'Queen''s Gambit Ltd.');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (103, 'MateMate Inc.');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (104, 'RookTech');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (105, 'PawnPower Solutions');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (106, 'CheckSecure AG');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (107, 'Endgame Enterprises');
INSERT INTO sponsors (sponsor_id, sponsor_name) VALUES (108, 'King''s Arena Foundation');
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (1, 'Knights', 'carol', '2023-01-01', '2026-01-01', 100);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (2, 'Rooks', 'david_b', '2024-02-15', '2026-02-15', 101);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (3, 'Bishops', 'emma_green', '2022-01-03', '2025-01-03', 102);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (4, 'Pawns', 'fatih', '2024-10-05', '2026-10-05', 100);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (5, 'Queens', 'hana', '2023-01-04', '2024-01-10', 103);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (6, 'Kings', 'lucaas', '2024-01-01', '2025-01-01', 104);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (7, 'Castles', 'mia_rose', '2024-01-06', '2025-01-06', 101);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (8, 'Checkmates', 'onur', '2023-03-15', '2025-09-15', 105);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (9, 'En Passants', 'sofia_lop', '2024-01-05', '2025-01-11', 106);
INSERT INTO teams (team_id, team_name, coach_username, contract_start, contract_finish, sponsor_id) VALUES (10, 'Blitz Masters', 'arslan_yusuf', '2024-01-02', '2026-01-08', 107);
INSERT INTO player_teams (username, team_id) VALUES ('alice', 1);
INSERT INTO player_teams (username, team_id) VALUES ('bob1', 2);
INSERT INTO player_teams (username, team_id) VALUES ('clara', 3);
INSERT INTO player_teams (username, team_id) VALUES ('david', 4);
INSERT INTO player_teams (username, team_id) VALUES ('emma', 5);
INSERT INTO player_teams (username, team_id) VALUES ('felix', 6);
INSERT INTO player_teams (username, team_id) VALUES ('grace', 7);
INSERT INTO player_teams (username, team_id) VALUES ('henry', 8);
INSERT INTO player_teams (username, team_id) VALUES ('isabel', 9);
INSERT INTO player_teams (username, team_id) VALUES ('jack', 10);
INSERT INTO player_teams (username, team_id) VALUES ('kara', 1);
INSERT INTO player_teams (username, team_id) VALUES ('liam', 2);
INSERT INTO player_teams (username, team_id) VALUES ('mia', 3);
INSERT INTO player_teams (username, team_id) VALUES ('noah', 4);
INSERT INTO player_teams (username, team_id) VALUES ('olivia', 5);
INSERT INTO player_teams (username, team_id) VALUES ('peter', 6);
INSERT INTO player_teams (username, team_id) VALUES ('quinn', 7);
INSERT INTO player_teams (username, team_id) VALUES ('rachel', 8);
INSERT INTO player_teams (username, team_id) VALUES ('sam', 9);
INSERT INTO player_teams (username, team_id) VALUES ('tina', 10);
INSERT INTO player_teams (username, team_id) VALUES ('umar', 1);
INSERT INTO player_teams (username, team_id) VALUES ('vera', 2);
INSERT INTO player_teams (username, team_id) VALUES ('will', 3);
INSERT INTO player_teams (username, team_id) VALUES ('xena', 4);
INSERT INTO player_teams (username, team_id) VALUES ('yusuff', 5);
INSERT INTO player_teams (username, team_id) VALUES ('zoe', 6);
INSERT INTO player_teams (username, team_id) VALUES ('hakan', 7);
INSERT INTO player_teams (username, team_id) VALUES ('julia', 8);
INSERT INTO player_teams (username, team_id) VALUES ('mehmet', 9);
INSERT INTO player_teams (username, team_id) VALUES ('elena', 10);
INSERT INTO player_teams (username, team_id) VALUES ('nina', 1);
INSERT INTO player_teams (username, team_id) VALUES ('louis', 2);
INSERT INTO player_teams (username, team_id) VALUES ('sofia', 3);
INSERT INTO player_teams (username, team_id) VALUES ('ryan', 4);
INSERT INTO player_teams (username, team_id) VALUES ('claire', 5);
INSERT INTO player_teams (username, team_id) VALUES ('jacob', 6);
INSERT INTO player_teams (username, team_id) VALUES ('ava', 7);
INSERT INTO player_teams (username, team_id) VALUES ('ethan', 8);
INSERT INTO player_teams (username, team_id) VALUES ('isabella', 9);
INSERT INTO player_teams (username, team_id) VALUES ('logan', 10);
INSERT INTO player_teams (username, team_id) VALUES ('sophia', 1);
INSERT INTO player_teams (username, team_id) VALUES ('lucas', 2);
INSERT INTO player_teams (username, team_id) VALUES ('harper', 3);
INSERT INTO player_teams (username, team_id) VALUES ('james', 4);
INSERT INTO player_teams (username, team_id) VALUES ('amelia', 5);
INSERT INTO player_teams (username, team_id) VALUES ('benjamin', 6);
INSERT INTO player_teams (username, team_id) VALUES ('ella', 7);
INSERT INTO player_teams (username, team_id) VALUES ('alex', 8);
INSERT INTO player_teams (username, team_id) VALUES ('lily', 9);
INSERT INTO coach_certifications (certification_name) VALUES ('FIDE Certified');
INSERT INTO coach_certifications (certification_name) VALUES ('National Level');
INSERT INTO coach_certifications (certification_name) VALUES ('Regional Certified');
INSERT INTO coach_certifications (certification_name) VALUES ('Club Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('carol', 'FIDE Certified');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('carol', 'National Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('david_b', 'National Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('emma_green', 'FIDE Certified');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('fatih', 'National Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('hana', 'Regional Certified');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('lucaas', 'Club Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('lucaas', 'Regional Certified');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('mia_rose', 'FIDE Certified');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('onur', 'National Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('sofia_lop', 'Regional Certified');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('arslan_yusuf', 'Club Level');
INSERT INTO coach_has_certification (username, certification_name) VALUES ('arslan_yusuf', 'National Level');
INSERT INTO arbiter_certifications (certification_name) VALUES ('FIDE Certified');
INSERT INTO arbiter_certifications (certification_name) VALUES ('National Arbiter');
INSERT INTO arbiter_certifications (certification_name) VALUES ('International Arbiter');
INSERT INTO arbiter_certifications (certification_name) VALUES ('Local Certification');
INSERT INTO arbiter_certifications (certification_name) VALUES ('Regional Certification');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('erin', 'FIDE Certified');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('mark', 'National Arbiter');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('lucy', 'International Arbiter');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('ahmet', 'Local Certification');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('ana', 'FIDE Certified');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('james', 'Regional Certification');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('sara', 'International Arbiter');
INSERT INTO arbiter_has_certification (username, certification_name) VALUES ('mohamed', 'National Arbiter');
INSERT INTO arbiters (username, experience_level) VALUES ('erin', 'Advanced');
INSERT INTO arbiters (username, experience_level) VALUES ('mark', 'Intermediate');
INSERT INTO arbiters (username, experience_level) VALUES ('lucy', 'Expert');
INSERT INTO arbiters (username, experience_level) VALUES ('ahmet', 'Beginner');
INSERT INTO arbiters (username, experience_level) VALUES ('ana', 'Advanced');
INSERT INTO arbiters (username, experience_level) VALUES ('james', 'Intermediate');
INSERT INTO arbiters (username, experience_level) VALUES ('sara', 'Expert');
INSERT INTO arbiters (username, experience_level) VALUES ('mohamed', 'Advanced');
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (1, 'Grandmaster Arena', 'USA', 10);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (2, 'Royal Chess Hall', 'UK', 8);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (3, 'FIDE Dome', 'Germany', 12);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (4, 'Masters Pavilion', 'Turkey', 6);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (5, 'Checkmate Center', 'France', 9);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (6, 'ELO Stadium', 'Spain', 10);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (7, 'Tactical Grounds', 'Italy', 7);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (8, 'Endgame Hall', 'India', 8);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (9, 'Strategic Square', 'Canada', 6);
INSERT INTO halls (hall_id, hall_name, hall_country, hall_capacity) VALUES (10, 'Opening Hall', 'Japan', 5);
INSERT INTO tables (hall_id, table_id) VALUES (1, 1);
INSERT INTO tables (hall_id, table_id) VALUES (1, 2);
INSERT INTO tables (hall_id, table_id) VALUES (1, 3);
INSERT INTO tables (hall_id, table_id) VALUES (2, 4);
INSERT INTO tables (hall_id, table_id) VALUES (2, 5);
INSERT INTO tables (hall_id, table_id) VALUES (3, 6);
INSERT INTO tables (hall_id, table_id) VALUES (3, 7);
INSERT INTO tables (hall_id, table_id) VALUES (3, 8);
INSERT INTO tables (hall_id, table_id) VALUES (4, 9);
INSERT INTO tables (hall_id, table_id) VALUES (5, 10);
INSERT INTO tables (hall_id, table_id) VALUES (6, 11);
INSERT INTO tables (hall_id, table_id) VALUES (6, 12);
INSERT INTO tables (hall_id, table_id) VALUES (7, 13);
INSERT INTO tables (hall_id, table_id) VALUES (8, 14);
INSERT INTO tables (hall_id, table_id) VALUES (9, 15);
INSERT INTO tables (hall_id, table_id) VALUES (10, 16);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (1, '2025-01-02', 1, 1, 1, 1, 2, 'alice', 'bob1', 'erin', 8.2, 'draw', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (2, '2025-01-02', 3, 1, 2, 3, 4, 'clara', 'david', 'lucy', 7.9, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (3, '2025-02-02', 1, 2, 1, 5, 6, 'emma', 'felix', 'mark', NULL, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (4, '2025-02-02', 3, 2, 2, 7, 8, 'grace', 'henry', 'erin', 8.5, 'draw', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (5, '2025-03-02', 1, 3, 1, 9, 10, 'isabel', 'jack', 'lucy', NULL, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (6, '2025-03-02', 3, 3, 2, 1, 3, 'kara', 'liam', 'mohamed', NULL, 'white_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (7, '2025-04-02', 1, 4, 1, 2, 5, 'mia', 'noah', 'erin', 4.5, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (8, '2025-04-02', 3, 4, 2, 6, 7, 'olivia', 'peter', 'sara', 3.1, 'white_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (9, '2025-05-02', 1, 5, 1, 8, 9, 'quinn', 'rachel', 'ana', 7.7, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (10, '2025-05-02', 3, 5, 2, 10, 1, 'sam', 'tina', 'mark', 6.4, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (11, '2025-06-02', 1, 1, 1, 3, 5, 'tina', 'umar', 'james', 5.1, 'white_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (12, '2025-06-02', 3, 1, 2, 4, 6, 'umar', 'vera', 'lucy', NULL, 'white_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (13, '2025-07-02', 1, 2, 1, 7, 9, 'vera', 'will', 'sara', NULL, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (14, '2025-07-02', 3, 2, 2, 8, 10, 'will', 'xena', 'mohamed', 2.6, 'draw', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (15, '2025-08-02', 1, 3, 1, 1, 4, 'xena', 'yusuff', 'erin', 7.1, 'draw', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (16, '2025-08-02', 3, 3, 2, 2, 5, 'yusuff', 'zoe', 'ana', 6.3, 'white_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (17, '2025-09-02', 1, 4, 1, 3, 6, 'zoe', 'hakan', 'james', NULL, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (18, '2025-09-02', 3, 4, 2, 7, 10, 'hakan', 'julia', 'mark', 4.9, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (19, '2025-10-02', 1, 5, 1, 5, 8, 'julia', 'mehmet', 'lucy', 9.7, 'black_wins', NULL);
INSERT INTO matches (match_id, date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_username, black_player_username, arbiter_username, rating, match_result, tournament_id) VALUES (20, '2025-10-02', 3, 5, 2, 6, 9, 'mehmet', 'elena', 'ahmet', 7.4, 'white_wins', NULL);

SET foreign_key_checks = 1
