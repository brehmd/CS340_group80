-- DML.sql - Updated Queries (Based on Actions Taken & Feedback)
-- DML.sql - Updated Queries Based on app.js

-- Retrieve all patients with optional search filter
SELECT patient_id, first_name, last_name, age, phone_number, esi_level
FROM Patients
WHERE ${filter_attributes} LIKE "${search_entry}%";

-- Retrieve all treatments with optional search filter
SELECT treatment_id, description, cost
FROM Treatments
WHERE ${filter_attributes} LIKE "${search_entry}%";

-- Retrieve all doctors with optional search filter
SELECT doctor_id, first_name, last_name, specialization
FROM Doctors
WHERE ${filter_attributes} LIKE "${search_entry}%";

-- Retrieve all departments with optional search filter
SELECT department_id, name, location
FROM Departments
WHERE ${filter_attributes} LIKE "${search_entry}%";

-- Retrieve all appointments with patient, doctor, and department names
SELECT 
    a.appointment_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    dept.name AS department_name,
    a.appointment_date,
    a.appointment_time,
    a.reason
FROM Appointments a
LEFT JOIN Patients p ON a.patient_id = p.patient_id
LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
JOIN Departments dept ON a.department_id = dept.department_id;

-- Retrieve all patients for dropdown
SELECT patient_id, CONCAT(first_name, ' ', last_name) AS patient_name
FROM Patients;

-- Retrieve all doctors for dropdown
SELECT doctor_id, CONCAT(first_name, ' ', last_name) AS doctor_name
FROM Doctors;

-- Retrieve all departments for dropdown
SELECT department_id, name
FROM Departments;

-- Retrieve all treatments for dropdown
SELECT treatment_id, description
FROM Treatments;

-- Insert a new patient
INSERT INTO Patients (first_name, last_name, age, phone_number, esi_level)
VALUES (?, ?, ?, ?, ?);

-- Insert a new treatment
INSERT INTO Treatments (description, cost)
VALUES (?, ?);

-- Insert a new doctor
INSERT INTO Doctors (first_name, last_name, specialization)
VALUES (?, ?, ?);

-- Insert a new department
INSERT INTO Departments (name, location)
VALUES (?, ?);

-- Insert a new appointment
INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, reason)
VALUES (?, ?, ?, ?, ?, ?);

-- Insert a new patient-treatment relationship
INSERT INTO Patients_Treatments (patient_id, treatment_id)
VALUES (?, ?);

-- Insert a new doctor-department relationship
INSERT INTO Doctors_Departments (doctor_id, department_id)
VALUES (?, ?);

-- Update a patient
UPDATE Patients
SET first_name = ?, last_name = ?, age = ?, phone_number = ?, esi_level = ?
WHERE patient_id = ?;

-- Update a treatment
UPDATE Treatments
SET description = ?, cost = ?
WHERE treatment_id = ?;

-- Update a doctor
UPDATE Doctors
SET first_name = ?, last_name = ?, specialization = ?
WHERE doctor_id = ?;

-- Update a department
UPDATE Departments
SET name = ?, location = ?
WHERE department_id = ?;

-- Update an appointment
UPDATE Appointments
SET patient_id = ?, doctor_id = ?, department_id = ?, appointment_date = ?, appointment_time = ?, reason = ?
WHERE appointment_id = ?;

-- Update a patient-treatment relationship
UPDATE Patients_Treatments
SET patient_id = ?, treatment_id = ?
WHERE patient_treatment_id = ?;

-- Update a doctor-department relationship
UPDATE Doctors_Departments
SET doctor_id = ?, department_id = ?
WHERE doctor_department_id = ?;

-- Delete a patient
UPDATE Appointments SET patient_id = NULL WHERE patient_id = ?;
DELETE FROM Patients_Treatments WHERE patient_id = ?;
DELETE FROM Patients WHERE patient_id = ?;

-- Delete a treatment
DELETE FROM Patients_Treatments WHERE treatment_id = ?;
DELETE FROM Treatments WHERE treatment_id = ?;

-- Delete a doctor
UPDATE Appointments SET doctor_id = NULL WHERE doctor_id = ?;
DELETE FROM Doctors_Departments WHERE doctor_id = ?;
DELETE FROM Doctors WHERE doctor_id = ?;

-- Delete a department
DELETE FROM Appointments WHERE department_id = ?;
DELETE FROM Doctors_Departments WHERE department_id = ?;
DELETE FROM Departments WHERE department_id = ?;

-- Delete an appointment
DELETE FROM Appointments WHERE appointment_id = ?;

-- Delete a patient-treatment relationship
DELETE FROM Patients_Treatments WHERE patient_treatment_id = ?;

-- Delete a doctor-department relationship
DELETE FROM Doctors_Departments WHERE doctor_department_id = ?;

-- Retrieve all patient-treatment relationships with names
SELECT 
    pt.patient_treatment_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    t.description AS treatment_description
FROM Patients_Treatments pt
LEFT JOIN Patients p ON pt.patient_id = p.patient_id
LEFT JOIN Treatments t ON pt.treatment_id = t.treatment_id;

-- Retrieve all doctor-department relationships with names
SELECT 
    dd.doctor_department_id,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    dept.name AS department_name
FROM Doctors_Departments dd
LEFT JOIN Doctors d ON dd.doctor_id = d.doctor_id
LEFT JOIN Departments dept ON dd.department_id = dept.department_id;