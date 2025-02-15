-- SELECT Queries

-- 1. Retrieve all patients
SELECT * FROM Patients;

-- 2. Retrieve all doctors
SELECT * FROM Doctors;

-- 3. Retrieve all departments
SELECT * FROM Departments;

-- 4. Retrieve all treatments
SELECT * FROM Treatments;

-- 5. Retrieve all appointments
SELECT * FROM Appointments;

-- 6. Retrieve all doctors in a specific department
SELECT d.doctor_id, d.first_name, d.last_name, d.specialization
FROM Doctors d
JOIN Doctors_Departments dd ON d.doctor_id = dd.doctor_id
WHERE dd.department_id = ?;

-- 7. Retrieve treatments for a specific patient
SELECT t.treatment_id, t.treatment_description, t.cost
FROM Treatments t
JOIN Patients_Treatments pt ON t.treatment_id = pt.treatment_id
WHERE pt.patient_id = ?;

-- 8. Retrieve all patients for dropdown
SELECT patient_id, CONCAT(first_name, ' ', last_name) AS patient_name FROM Patients;

-- 9. Retrieve all doctors for dropdown
SELECT doctor_id, CONCAT(first_name, ' ', last_name, ' - ', specialization) AS doctor_info FROM Doctors;

-- 10. Retrieve all departments for dropdown
SELECT department_id, name FROM Departments;

-- 11. Retrieve all treatments for dropdown
SELECT treatment_id, treatment_description FROM Treatments;

-- INSERT Queries

-- 1. Insert a new patient
INSERT INTO Patients (first_name, last_name, age, phone_number, esi_id)
VALUES (?, ?, ?, ?, ?);

-- 2. Insert a new doctor
INSERT INTO Doctors (first_name, last_name, specialization)
VALUES (?, ?, ?);

-- 3. Insert a new department
INSERT INTO Departments (name, location)
VALUES (?, ?);

-- 4. Insert a new treatment
INSERT INTO Treatments (treatment_description, cost)
VALUES (?, ?);

-- 5. Insert a new appointment
INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, reason)
VALUES (?, ?, ?, ?, ?);

-- 6. Insert a new doctor to department assignment
INSERT INTO Doctors_Departments (doctor_id, department_id)
VALUES (?, ?);

-- 7. Insert a new patient treatment record
INSERT INTO Patients_Treatments (patient_id, treatment_id)
VALUES (?, ?);

-- INSERT using subqueries (Alternative without ID input)
INSERT INTO Patients_Treatments (patient_id, treatment_id)
VALUES (
    (SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?),
    (SELECT treatment_id FROM Treatments WHERE treatment_description = ?)
);

-- UPDATE Queries

-- 1. Update a patient
UPDATE Patients
SET first_name = ?, last_name = ?, age = ?, phone_number = ?, esi_id = ?
WHERE patient_id = ?;

-- 2. Update a doctor
UPDATE Doctors
SET first_name = ?, last_name = ?, specialization = ?
WHERE doctor_id = ?;

-- 3. Update a department
UPDATE Departments
SET name = ?, location = ?
WHERE department_id = ?;

-- 4. Update a treatment
UPDATE Treatments
SET treatment_description = ?, cost = ?
WHERE treatment_id = ?;

-- 5. Update an appointment
UPDATE Appointments
SET patient_id = ?, doctor_id = ?, department_id = ?, appointment_date = ?, reason = ?
WHERE appointment_id = ?;

-- 6. Update a patient treatment record (M:M Update)
UPDATE Patients_Treatments
SET patient_id = ?, treatment_id = ?
WHERE patient_treatment_id = ?;

-- 7. Remove relationship (set FK to NULL in Appointments)
UPDATE Appointments
SET patient_id = NULL
WHERE appointment_id = ?;

-- DELETE Queries

-- 1. Delete a patient
DELETE FROM Patients WHERE patient_id = ?;

-- 2. Delete a doctor
DELETE FROM Doctors WHERE doctor_id = ?;

-- 3. Delete a department
DELETE FROM Departments WHERE department_id = ?;

-- 4. Delete a treatment
DELETE FROM Treatments WHERE treatment_id = ?;

-- 5. Delete an appointment
DELETE FROM Appointments WHERE appointment_id = ?;

-- 6. Remove a doctor from a department
DELETE FROM Doctors_Departments WHERE doctor_department_id = ?;

-- 7. Remove a treatment from a patient
DELETE FROM Patients_Treatments WHERE patient_treatment_id = ?;
