```sql
-- Drop existing tables if they exist to ensure a clean slate (reverse d 
DROP TABLE IF EXISTS Team_participates_in_Tournament; DROP TABLE IF EXISTS Tournament_held_in; DROP TABLE IF EXISTS Arbiter_has_arbiter_cert; DROP TABLE IF EXISTS Coach_has_certification; DROP TABLE IF EXISTS Coach_has_specialty; DROP TABLE IF EXISTS Player_plays_for_Team; DROP TABLE IF EXISTS ChessMatch; DROP TABLE IF EXISTS Tournament; DROP TABLE IF EXISTS ‘Table ‘; DROP TABLE IF EXISTS Hall; DROP TABLE IF EXISTS ArbiterCertification; DROP TABLE IF EXISTS CoachCertification; DROP TABLE IF EXISTS Specialty; DROP TABLE IF EXISTS Team; DROP TABLE IF EXISTS Sponsor; DROP TABLE IF EXISTS Arbiter; DROP TABLE IF EXISTS Coach; DROP TABLE IF EXISTS Player; DROP TABLE IF EXISTS Title; DROP TABLE IF EXISTS User;
-- 1. User Table (Superclass for Player, Coach , Arbiter) 
CREATE TABLE User ( username VARCHAR (50) PRIMARY KEY , password VARCHAR (50) NOT NULL , name VARCHAR (50) NOT NULL , surname VARCHAR (50) NOT NULL , nationality VARCHAR (50) NOT NULL
);
-- 2. Title Table (For Player titles like GM, IM, etc.) 
CREATE TABLE Title ( title_ID INT PRIMARY KEY , title_name VARCHAR (50) NOT NULL UNIQUE
);
-- 3. Player Table (Subclass of User, references User and Title) 
CREATE TABLE Player (
username VARCHAR (50) PRIMARY KEY ,
date_of_birth DATE NOT NULL ,
elo_rating INT NOT NULL CHECK (elo_rating > 1000) ,
fide_ID VARCHAR (20) NOT NULL UNIQUE ,
title_ID INT ,
FOREIGN KEY (username) REFERENCES User(username),
FOREIGN KEY (title_ID) REFERENCES Title(title_ID)
);
-- 4. Coach Table (Subclass of User, references User)
CREATE TABLE Coach (
username VARCHAR (50) PRIMARY KEY ,
FOREIGN KEY (username) REFERENCES User(username)
);
-- 5. Arbiter Table (Subclass of User, references User)
CREATE TABLE Arbiter (
username VARCHAR (50) PRIMARY KEY ,
experience_level VARCHAR (20) NOT NULL ,
FOREIGN KEY (username) REFERENCES User(username)
);
-- 6. Sponsor Table
CREATE TABLE Sponsor (
sponsor_ID INT PRIMARY KEY ,
sponsor_name VARCHAR (50) NOT NULL UNIQUE
);
-- 7. Team Table (References Coach and Sponsor)
CREATE TABLE Team (
team_ID INT PRIMARY KEY ,
team_name VARCHAR (50) NOT NULL ,
coach_username VARCHAR (50) NOT NULL UNIQUE ,
contract_start DATE NOT NULL ,
contract_finish DATE NOT NULL ,
sponsor_ID INT NOT NULL ,
FOREIGN KEY (coach_username) REFERENCES Coach(username),
FOREIGN KEY (sponsor_ID) REFERENCES Sponsor(sponsor_ID),
CHECK (contract_finish > contract_start)
);
-- 8. Specialty Table (For Coach specialties)
CREATE TABLE Specialty (
4specialty_name VARCHAR (50) PRIMARY KEY
);
-- 9. CoachCertification Table (For Coach certifications)
CREATE TABLE CoachCertification (
certification_name VARCHAR (50) PRIMARY KEY
);
-- 10. ArbiterCertification Table (For Arbiter certifications)
CREATE TABLE ArbiterCertification (
certification_name VARCHAR (50) PRIMARY KEY
);
-- 11. Hall Table
CREATE TABLE Hall (
hall_ID INT PRIMARY KEY ,
hall_name VARCHAR (50) NOT NULL ,
hall_country VARCHAR (50) NOT NULL ,
hall_capacity INT NOT NULL CHECK (hall_capacity > 0)
);
-- 12. Table Table (Weak entity dependent on Hall)
CREATE TABLE ‘Table ‘ (
hall_ID INT ,
table_ID INT ,
PRIMARY KEY (hall_ID , table_ID),
FOREIGN KEY (hall_ID) REFERENCES Hall(hall_ID)
);
-- 13. Tournament Table (References Arbiter)
CREATE TABLE Tournament (
tournament_ID INT PRIMARY KEY ,
tournament_name VARCHAR (50) NOT NULL ,
start_date DATE NOT NULL ,
end_date DATE NOT NULL ,
format VARCHAR (20) NOT NULL ,
chief_arbiter_username VARCHAR (50) NOT NULL ,
FOREIGN KEY (chief_arbiter_username) REFERENCES Arbiter(username),
CHECK (end_date >= start_date)
);
-- 14. ChessMatch Table (References Tournament , Table , Team, Player, Arb
CREATE TABLE ChessMatch (
5match_ID INT PRIMARY KEY ,
tournament_ID INT NOT NULL ,
hall_ID INT NOT NULL ,
table_ID INT NOT NULL ,
match_date DATE NOT NULL ,
start_slot INT NOT NULL CHECK (start_slot BETWEEN 1 AND 3),
white_team_ID INT NOT NULL ,
white_player_username VARCHAR (50) NOT NULL ,
black_team_ID INT NOT NULL ,
black_player_username VARCHAR (50) NOT NULL ,
assigned_arbiter_username VARCHAR (50) NOT NULL ,
rating INT CHECK (rating BETWEEN 1 AND 10),
result VARCHAR (10) NOT NULL CHECK (result IN (’white_wins ’, ’black_w
FOREIGN KEY (tournament_ID) REFERENCES Tournament(tournament_ID),
FOREIGN KEY (hall_ID , table_ID) REFERENCES ‘Table ‘(hall_ID , table_ID
FOREIGN KEY (white_team_ID) REFERENCES Team(team_ID),
FOREIGN KEY (white_player_username) REFERENCES Player(username),
FOREIGN KEY (black_team_ID) REFERENCES Team(team_ID),
FOREIGN KEY (black_player_username) REFERENCES Player(username),
FOREIGN KEY (assigned_arbiter_username) REFERENCES Arbiter(username)
CHECK (white_player_username != black_player_username),
CHECK (white_team_ID != black_team_ID),
CONSTRAINT unique_match_schedule UNIQUE (hall_ID , table_ID , match_da
);
-- 15. Player_plays_for_Team (Many -to-Many: Player and Team)
CREATE TABLE Player_plays_for_Team (
username VARCHAR (50),
team_ID INT ,
PRIMARY KEY (username , team_ID),
FOREIGN KEY (username) REFERENCES Player(username),
FOREIGN KEY (team_ID) REFERENCES Team(team_ID)
);
-- 16. Coach_has_specialty (Many -to-Many: Coach and Specialty)
CREATE TABLE Coach_has_specialty (
username VARCHAR (50),
specialty_name VARCHAR (50),
PRIMARY KEY (username , specialty_name),
FOREIGN KEY (username) REFERENCES Coach(username),
FOREIGN KEY (specialty_name) REFERENCES Specialty(specialty_name)
);
6-- 17. Coach_has_certification (Many -to-Many: Coach and CoachCertificati CREATE TABLE Coach_has_certification ( username VARCHAR (50), certification_name VARCHAR (50), PRIMARY KEY (username , certification_name), FOREIGN KEY (username) REFERENCES Coach(username), FOREIGN KEY (certification_name) REFERENCES CoachCertification(certi
);
-- 18. Arbiter_has_arbiter_cert (Many -to-Many: Arbiter and ArbiterCertif CREATE TABLE Arbiter_has_arbiter_cert ( username VARCHAR (50), certification_name VARCHAR (50), PRIMARY KEY (username , certification_name), FOREIGN KEY (username) REFERENCES Arbiter(username), FOREIGN KEY (certification_name) REFERENCES ArbiterCertification(cer
);
-- 19. Tournament_held_in (Many -to-Many: Tournament and Hall) CREATE TABLE Tournament_held_in ( tournament_ID INT , hall_ID INT , PRIMARY KEY (tournament_ID , hall_ID), FOREIGN KEY (tournament_ID) REFERENCES Tournament(tournament_ID), FOREIGN KEY (hall_ID) REFERENCES Hall(hall_ID)
);
-- 20. Team_participates_in_Tournament (Many -to-Many: Team and Tournamen CREATE TABLE Team_participates_in_Tournament ( team_ID INT , tournament_ID INT , PRIMARY KEY (team_ID , tournament_ID), FOREIGN KEY (team_ID) REFERENCES Team(team_ID), FOREIGN KEY (tournament_ID) REFERENCES Tournament(tournament_ID)
);
```