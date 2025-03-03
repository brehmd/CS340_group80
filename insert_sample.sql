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
INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, reason) VALUES
(1, 1, 1, '2025-02-10', '10:00:00', 'Routine Checkup'),
(2, 2, 2, '2025-02-11', '11:00:00', 'Migraine Consultation'),
(3, 3, 3, '2025-02-12', '12:00:00', 'Pediatric Follow-up'),
(4, 4, 4, '2025-02-13', '13:00:00', 'Cancer Screening'),
(5, 5, 5, '2025-02-14', '14:00:00', 'Joint Pain Consultation');

-- Treatments Data
INSERT INTO Treatments (description, cost) VALUES
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