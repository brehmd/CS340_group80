-- DML.sql - Updated Queries (Based on Actions Taken & Feedback)

-- SELECT Queries with FK Names instead of IDs

-- Retrieve all patients (Now including esi_level as VARCHAR)
SELECT patient_id, 
       CONCAT(first_name, ' ', last_name) AS patient_name, 
       age, 
       phone_number, 
       esi_level  -- No longer an FK, now stored directly in Patients
FROM Patients;

-- Retrieve all doctors
SELECT * FROM Doctors;

-- Retrieve all departments
SELECT * FROM Departments;

-- Retrieve all treatments
SELECT * FROM Treatments;

-- Retrieve all appointments with names instead of IDs (Ensuring user-friendly FK representation)
SELECT a.appointment_id, 
       CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
       CONCAT(d.first_name, ' ', d.last_name) AS doctor_name, 
       dept.name AS department_name, 
       a.appointment_date, 
       a.reason
FROM Appointments a
LEFT JOIN Patients p ON a.patient_id = p.patient_id
LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
LEFT JOIN Departments dept ON a.department_id = dept.department_id;

-- Insert Queries using subqueries to dynamically retrieve FK values
INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, reason)
VALUES 
    ((SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?),
     (SELECT doctor_id FROM Doctors WHERE first_name = ? AND last_name = ?),
     (SELECT department_id FROM Departments WHERE name = ?), ?, ?),
    ((SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?),
     (SELECT doctor_id FROM Doctors WHERE first_name = ? AND last_name = ?),
     (SELECT department_id FROM Departments WHERE name = ?), ?, ?); -- Additional patient with multiple appointments

-- Safe Update for Appointments (Allowing NULL for FK safety)
UPDATE Appointments
SET patient_id = COALESCE((SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?), NULL),
    doctor_id = COALESCE((SELECT doctor_id FROM Doctors WHERE first_name = ? AND last_name = ?), NULL),
    department_id = (SELECT department_id FROM Departments WHERE name = ?),
    appointment_date = ?,
    reason = ?
WHERE appointment_id = ?;

-- Safe Deletion of Patients (Preserving Appointments' history)
UPDATE Appointments SET patient_id = NULL WHERE patient_id = ?;
DELETE FROM Patients WHERE patient_id = ?;

-- Retrieve doctors in a specific department with readable names
SELECT d.doctor_id, CONCAT(d.first_name, ' ', d.last_name) AS doctor_name, d.specialization
FROM Doctors d
JOIN Doctors_Departments dd ON d.doctor_id = dd.doctor_id
JOIN Departments dept ON dd.department_id = dept.department_id
WHERE dept.name = ?;

-- Retrieve treatments for a specific patient (Ensuring names instead of IDs)
SELECT pt.patient_treatment_id, 
       CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
       t.treatment_description, 
       t.cost
FROM Patients_Treatments pt
JOIN Patients p ON pt.patient_id = p.patient_id
JOIN Treatments t ON pt.treatment_id = t.treatment_id
WHERE p.first_name = ? AND p.last_name = ?;

-- Dropdown Queries for Forms
SELECT patient_id, CONCAT(first_name, ' ', last_name) AS patient_name FROM Patients;
SELECT doctor_id, CONCAT(first_name, ' ', last_name, ' - ', specialization) AS doctor_info FROM Doctors;
SELECT department_id, name FROM Departments;
SELECT treatment_id, treatment_description FROM Treatments;

-- Retrieve all Patients_Treatments with names instead of IDs
SELECT pt.patient_treatment_id, 
       CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
       t.treatment_description
FROM Patients_Treatments pt
JOIN Patients p ON pt.patient_id = p.patient_id
JOIN Treatments t ON pt.treatment_id = t.treatment_id;

-- Retrieve all Doctors_Departments with names instead of IDs
SELECT dd.doctor_department_id, 
       CONCAT(d.first_name, ' ', d.last_name) AS doctor_name, 
       dept.name AS department_name
FROM Doctors_Departments dd
JOIN Doctors d ON dd.doctor_id = d.doctor_id
JOIN Departments dept ON dd.department_id = dept.department_id;

-- Insert Queries using subqueries for FK values
INSERT INTO Patients (first_name, last_name, age, phone_number, esi_level)
VALUES (?, ?, ?, ?, ?); -- esi_level is now a VARCHAR and no longer references ESI_Index

INSERT INTO Doctors (first_name, last_name, specialization)
VALUES (?, ?, ?);

INSERT INTO Departments (name, location)
VALUES (?, ?);

INSERT INTO Treatments (treatment_description, cost)
VALUES (?, ?);

-- Update patient treatment relationships safely
UPDATE Patients_Treatments
SET patient_id = (SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?),
    treatment_id = (SELECT treatment_id FROM Treatments WHERE treatment_description = ?)
WHERE patient_treatment_id = ?;

-- Safe Deletion with Cascading Constraints
DELETE FROM Patients WHERE patient_id = ?;
DELETE FROM Doctors WHERE doctor_id = ?;
DELETE FROM Departments WHERE department_id = ?;
DELETE FROM Treatments WHERE treatment_id = ?;
DELETE FROM Appointments WHERE appointment_id = ?;
DELETE FROM Doctors_Departments WHERE doctor_department_id = ?;
DELETE FROM Patients_Treatments WHERE patient_treatment_id = ?;
