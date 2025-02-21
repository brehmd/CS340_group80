-- Drop Tables if they exist (Ensuring no conflicts before re-creating)
DROP TABLE IF EXISTS Patients_Treatments;
DROP TABLE IF EXISTS Doctors_Departments;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Treatments;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS ESI_Index;

-- Create Tables (Updated based on feedback: Removed ESI_Index and replaced with direct attribute in Patients table)
CREATE TABLE Patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT NOT NULL CHECK (age > 0), -- Ensures valid patient age
    phone_number VARCHAR(20) NOT NULL,
    esi_level VARCHAR(50) NOT NULL -- Previously referenced ESI_Index, now stored as direct attribute
);

CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL -- Specialization of doctor
);

CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL -- Physical location of department
);

CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NULL,
    doctor_id INT NULL,
    department_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    reason TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE SET NULL, -- Keeps appointment history even if patient is removed
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE SET NULL, -- Keeps appointment history even if doctor leaves
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE RESTRICT -- Prevents accidental department deletions
);

CREATE TABLE Treatments (
    treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    treatment_description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL -- Ensures proper currency formatting
);

CREATE TABLE Patients_Treatments (
    patient_treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    treatment_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE, -- Ensures treatment records are deleted with patient
    FOREIGN KEY (treatment_id) REFERENCES Treatments(treatment_id) ON DELETE CASCADE -- Ensures consistency when deleting treatments
);

CREATE TABLE Doctors_Departments (
    doctor_department_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE, -- Doctor removals clean up associations
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE -- Department removals clean up associations
);

-- Insert Sample Data (Expanded to include 5 entries per table)

-- Patients Data (Updated to store ESI Level directly as attribute)
INSERT INTO Patients (first_name, last_name, age, phone_number, esi_level) VALUES
('Alice', 'Smith', 45, '555-1234', '2 - Urgent'),
('John', 'Doe', 30, '555-5678', '3 - Moderate'),
('Maria', 'Lopez', 67, '555-9012', '1 - Emergency'),
('David', 'Kim', 52, '555-3456', '4 - Mild'),
('Emily', 'Zhang', 26, '555-7890', '2 - Urgent');

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
INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, reason) VALUES
(1, 1, 1, '2025-02-10', 'Routine Checkup'),
(2, 2, 2, '2025-02-11', 'Migraine Consultation'),
(3, 3, 3, '2025-02-12', 'Pediatric Follow-up'),
(4, 4, 4, '2025-02-13', 'Cancer Screening'),
(5, 5, 5, '2025-02-14', 'Joint Pain Consultation');

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
