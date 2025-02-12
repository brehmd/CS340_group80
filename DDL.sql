-- Hospital Management System Database Schema
-- Generated using MySQL DDL
-- Team: Aadil Ali, Dylan Brehm, Kuena Borling
-- CS 340 Project Step 2 Draft 

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Patients_Treatments;
DROP TABLE IF EXISTS Doctors_Departments;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Treatments;
DROP TABLE IF EXISTS Departments;

-- Create Patients Table
CREATE TABLE Patients (
    patientId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age > 0),
    phoneNumber VARCHAR(20) NOT NULL
);

-- Create Doctors Table
CREATE TABLE Doctors (
    doctorId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL
);

-- Create Departments Table
CREATE TABLE Departments (
    departmentId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE Appointments (
    appointmentId INT PRIMARY KEY AUTO_INCREMENT,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    departmentId INT NOT NULL,
    appointmentDate DATETIME NOT NULL,
    FOREIGN KEY (patientId) REFERENCES Patients(patientId) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Doctors(doctorId) ON DELETE CASCADE,
    FOREIGN KEY (departmentId) REFERENCES Departments(departmentId) ON DELETE CASCADE
);


-- Create Treatments Table
CREATE TABLE Treatments (
    treatmentId INT PRIMARY KEY AUTO_INCREMENT,
    treatmentDescription VARCHAR(500) NOT NULL
);

-- Create Patients_Treatments Intersection Table
CREATE TABLE Patients_Treatments (
    patientId INT,
    treatmentId INT,
    PRIMARY KEY (patientId, treatmentId),
    FOREIGN KEY (patientId) REFERENCES Patients(patientId) ON DELETE CASCADE,
    FOREIGN KEY (treatmentId) REFERENCES Treatments(treatmentId) ON DELETE CASCADE
);

-- Create Doctors_Departments Intersection Table
CREATE TABLE Doctors_Departments (
    doctorId INT,
    departmentId INT,
    PRIMARY KEY (doctorId, departmentId),
    FOREIGN KEY (doctorId) REFERENCES Doctors(doctorId) ON DELETE CASCADE,
    FOREIGN KEY (departmentId) REFERENCES Departments(departmentId) ON DELETE CASCADE
);

-- Insert Sample Data
INSERT INTO Patients (name, age, phoneNumber) VALUES
('John Doe', 30, '123-456-7890'),
('Jane Smith', 25, '987-654-3210'),
('Michael Brown', 40, '555-123-4567');

INSERT INTO Doctors (name, specialization) VALUES
('Dr. Adams', 'Cardiology'),
('Dr. Baker', 'Neurology'),
('Dr. Clark', 'Orthopedics');

INSERT INTO Departments (name, location) VALUES
('Cardiology', 'Building A'),
('Neurology', 'Building B'),
('Orthopedics', 'Building C');

INSERT INTO Appointments (patientId, doctorId, departmentId, appointmentDate) VALUES
(1, 1, 1, '2025-02-10 10:00:00'),
(2, 2, 2, '2025-02-11 14:30:00'),
(3, 3, 3, '2025-02-12 09:00:00');

INSERT INTO Treatments (treatmentDescription) VALUES
('Physical Therapy'),
('MRI Scan'),
('Cardiac Stress Test');

INSERT INTO Patients_Treatments (patientId, treatmentId) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO Doctors_Departments (doctorId, departmentId) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Verify Table Structure
SHOW TABLES;
DESCRIBE Patients;
DESCRIBE Doctors;
DESCRIBE Departments;
DESCRIBE Appointments;
DESCRIBE Treatments;
DESCRIBE Patients_Treatments;
DESCRIBE Doctors_Departments;

-- Verify Data Insertion
SELECT * FROM Patients;
SELECT * FROM Doctors;
SELECT * FROM Departments;
SELECT * FROM Appointments;
SELECT * FROM Treatments;
SELECT * FROM Patients_Treatments;
SELECT * FROM Doctors_Departments;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
