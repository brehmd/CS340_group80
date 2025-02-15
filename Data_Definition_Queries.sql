-- Drop Tables if they exist
DROP TABLE IF EXISTS Patients_Treatments;
DROP TABLE IF EXISTS Doctors_Departments;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Treatments;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS ESI_Index;

-- Create Tables
CREATE TABLE ESI_Index (
    esi_id INT PRIMARY KEY,
    severity_level VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE Patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    esi_id INT,
    FOREIGN KEY (esi_id) REFERENCES ESI_Index(esi_id)
);

CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL
);

CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL
);

CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    department_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    reason TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Treatments (
    treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    treatment_description VARCHAR(100) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Doctors_Departments (
    doctor_department_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Patients_Treatments (
    patient_treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    treatment_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (treatment_id) REFERENCES Treatments(treatment_id)
);

-- Insert Sample Data

-- ESI_Index Data
INSERT INTO ESI_Index (esi_id, severity_level, description) VALUES
(1, 'Critical', 'Immediate life-threatening'),
(2, 'Severe', 'High-risk emergency'),
(3, 'Moderate', 'Needs urgent attention'),
(4, 'Mild', 'Minor condition'),
(5, 'Non-Urgent', 'Low-priority case');

-- Patients Data
INSERT INTO Patients (first_name, last_name, age, phone_number, esi_id) VALUES
('Alice', 'Smith', 45, '555-1234', 2),
('John', 'Doe', 30, '555-5678', 3),
('Maria', 'Lopez', 67, '555-9012', 1),
('David', 'Kim', 52, '555-3456', 4),
('Emily', 'Zhang', 26, '555-7890', 2);

-- Doctors Data
INSERT INTO Doctors (first_name, last_name, specialization) VALUES
('Adams', 'Johnson', 'Cardiology'),
('Baker', 'Lee', 'Neurology'),
('Lee', 'Williams', 'Orthopedics'),
('Jenkins', 'Sue', 'General Surgery'),
('Who', 'Shane', 'Internal Medicine');

-- Departments Data
INSERT INTO Departments (name, location) VALUES
('Cardiology', '2nd Floor'),
('Neurology', '3rd Floor'),
('Internal Medicine', '1st Floor'),
('Orthopedics', '4th Floor'),
('General Surgery', '5th Floor');

-- Appointments Data
INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date) VALUES
(1, 1, 1, '2025-02-10 09:00:00'),
(2, 2, 2, '2025-02-11 10:30:00'),
(3, 3, 3, '2025-02-12 14:00:00'),
(4, 4, 4, '2025-02-13 16:15:00'),
(5, 5, 5, '2025-02-14 08:45:00');

-- Treatments Data
INSERT INTO Treatments (treatment_description, cost) VALUES
('Blood Pressure Control', 150.00),
('MRI Scan', 500.00),
('Routine Checkup', 200.00),
('Knee Surgery', 1000.00),
('Appendectomy', 3000.00);

-- Doctors_Departments Data
INSERT INTO Doctors_Departments (doctor_id, department_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(3, 1),
(2, 4);

-- Patients_Treatments Data
INSERT INTO Patients_Treatments (patient_id, treatment_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(3, 1),
(4, 2);