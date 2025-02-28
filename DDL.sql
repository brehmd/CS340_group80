-- Drop Tables if they exist (Ensuring no conflicts before re-creating)
DROP TABLE IF EXISTS Patients_Treatments;
DROP TABLE IF EXISTS Doctors_Departments;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Treatments;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Departments;

-- Removed DROP TABLE for ESI_Index as it no longer exists

-- Create Tables (Updated based on feedback)
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
    specialization VARCHAR(100) NOT NULL
);

CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL, -- Added missing time column
    reason TEXT NOT NULL, -- Ensured NOT NULL as per schema
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
);

CREATE TABLE Treatments (
    treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0) -- Ensuring valid non-negative cost
);

CREATE TABLE Patients_Treatments (
    patient_treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NULL, -- Changed from NOT NULL to allow NULL as per schema feedback
    treatment_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE SET NULL,
    FOREIGN KEY (treatment_id) REFERENCES Treatments(treatment_id) ON DELETE CASCADE
);

CREATE TABLE Doctors_Departments (
    doctor_department_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
<<<<<<< HEAD
);
=======
);
>>>>>>> a5bb977fdd8296f5add856ecc9816e584e2919b9
